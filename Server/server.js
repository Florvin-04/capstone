import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const salt = 10;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("./uploads"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "capstone",
});

db.connect((err) => {
  if (err) {
    console.log("Error in Connection");
  } else {
    console.log("connected");
  }
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({ Status: "error", Message: "Please Log In" });

  jwt.verify(token, "jwt-sample-secret-key", (err, decoded) => {
    if (err) return res.json({ Status: "error", Message: "Token Error" });

    req.first_name = decoded.first_name;
    req.last_name = decoded.last_name;
    req.id = decoded.id;
    next();
  });
};

app.get("/", verifyUser, (req, res) => {
  return res.json({
    Status: "success",
    Message: "Authorized",
    first_name: req.first_name,
    last_name: req.last_name,
    id: req.id,
  });
});

app.post("/register", (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  const emailCheckQuery = "SELECT * FROM users WHERE email_address = ?";

  db.query(emailCheckQuery, [email], (err, result) => {
    if (err) {
      return res.json({ Status: "error", Message: "Error in server" });
    }

    if (result.length > 0) {
      return res.json({ Status: "error", Message: "Email address already exists" });
    }

    const sql =
      "INSERT INTO users (email_address, first_name, last_name, password) VALUES (?,?,?,?)";

    bcrypt.hash(password.toString(), salt, (err, hashPassword) => {
      const data = [email, firstName, lastName, hashPassword];

      if (err) {
        return res.json({ Status: "error", Message: "Error in hashing password" });
      }
      db.query(sql, data, (err, result) => {
        if (err) {
          return res.json({ Status: "error", Message: "error in server" });
        }

        if (result) {
          return res.json({ Status: "success", Message: "User Created" });
        } else {
          return res.json({ Status: "success", Message: "error in creating user" });
        }
      });
    });

    // const sql =
    //   "INSERT INTO users (email_address, first_name, last_name, password) VALUES (?,?,?,?)";

    // db.query(sql, data, (err, result) => {
    //   if (err) {
    //     return res.json({ Status: "error", Message: "error in server" });
    //   }
    //   if (result) {
    //     return res.json({ Status: "success", Message: "User Created" });
    //   } else {
    //     return res.json({ Status: "success", Message: "error in creating user" });
    //   }
    // });
  });
});

// for hash pass
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // const data = [email, password];
  const sql = "SELECT * FROM users WHERE email_address = ?";

  db.query(sql, email, (err, result) => {
    if (err) {
      return res.json({ Status: "error", Message: "Error in Server" });
    }

    if (result.length > 0) {
      bcrypt.compare(password.toString(), result[0].password, (err, response) => {
        if (err) return res.json({ Status: "error", Message: "error in server" });

        if (response) {
          const first_name = result[0].first_name;
          const last_name = result[0].last_name;
          const id = result[0].id;
          const token = jwt.sign({ first_name, last_name, id }, "jwt-sample-secret-key", {
            expiresIn: "1d",
          });
          res.cookie("token", token, {
            sameSite: "None",
            secure: true, // Make sure to set secure to true if using HTTPS
          });
          return res.json({ Status: "success", Message: "Logged In" });
        } else {
          return res.json({ Status: "error", Message: "Incorrect Password" });
        }
      });
    } else {
      return res.json({ Status: "Error", Message: "No Email existed" });
    }
  });
});

// for not hash pass
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   const data = [email, password];
//   const sql = "SELECT * FROM users WHERE email_address = ? AND password = ?";

//   db.query(sql, data, (err, result) => {
//     if (err) {
//       return res.json({ Status: "Error", Message: "Error in Server" });
//     }

//     if (result.length > 0) {
//       return res.json({ Status: "Success" });
//     } else {
//       return res.json({ Status: "Error", Message: "Incorrect Email or Password" });
//     }
//   });
// });

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get Products Error" });
    return res.json({ Status: "Success", Result: result });
  });
});

app.get("/cart", (req, res) => {
  const { user_id } = req.query;
  // const user_id = req.query.user_id;
  const sql =
    "SELECT c.id, added_at, c.product_id, c.user_id, c.quantity, p.title, p.category, p.image, p.price FROM cart as c JOIN users as u ON c.user_id = u.id JOIN products as p ON p.id = c.product_id WHERE c.user_id = ? ORDER BY `c`.`added_at` DESC";

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.json({ Status: "error", Message: "Error in server" });
    return res.json({ Status: "success", Message: "fetch completed", id: user_id, Result: result });
  });
});

app.post("/add-to-cart", (req, res) => {
  const { product_id, user_id, quantity } = req.body;

  const checkQuery = "SELECT * FROM cart WHERE product_id = ? AND user_id = ?";

  db.query(checkQuery, [product_id, user_id], (err, result) => {
    if (err) return res.json({ Status: "error", Message: "Error in checking cart" });
    if (result.length > 0) {
      // const updateQuery = `UPDATE cart SET quantity = ${result[0].quantity} + ${quantity} WHERE product_id = ? AND user_id = ?`;
      const updateQuery = `UPDATE cart SET quantity = ? WHERE product_id = ? AND user_id = ?`;

      db.query(
        updateQuery,
        [[result[0].quantity + Number(quantity)], product_id, user_id],
        (err, result) => {
          if (err) return res.json({ Status: "error", Message: "Error in server" });

          if (result) return res.json({ Status: "success", Message: "success updating" });
        }
      );
    } else {
      const insertQuery = "INSERT INTO cart (product_id, user_id, quantity) VALUES (?, ?, ?)";
      db.query(insertQuery, [product_id, user_id, quantity], (err, result) => {
        if (err) return res.json({ Status: "error", Message: "Error in server" });

        if (result) return res.json({ Status: "success", Message: "success inserting" });
      });
    }
  });
});

app.post("/update-cart", (req, res) => {
  const { cartID, quantity, action } = req.body;

  const selectQuery = "SELECT * FROM cart WHERE id = ?";

  db.query(selectQuery, [cartID], (err, selectResult) => {
    if (err) {
      console.error("Error retrieving cart:", err);
      return res.json({ Status: "error", Message: "Error in server" });
    }

    if (selectResult.length > 0) {
      let updatedQuantity;
      const currentQuantity = selectResult[0].quantity;

      if (action === "update") {
        updatedQuantity = Number(quantity);
      } else if (action === "add") {
        updatedQuantity = currentQuantity + 1;
      } else if (action === "subtract") {
        updatedQuantity = currentQuantity - 1;
      } else {
        return res.json({ Status: "error", Message: "Invalid action" });
      }

      const updateQuery = "UPDATE cart SET quantity = ? WHERE id = ?";
      const values = [updatedQuantity, cartID];

      db.query(updateQuery, values, (err, updateResult) => {
        if (err) {
          console.error("Error updating cart:", err);
          return res.json({ Status: "error", Message: "Error in server" });
        }

        if (updateResult.affectedRows > 0) {
          const updatedCart = {
            ...selectResult[0],
            quantity: updatedQuantity,
            action,
          };
          return res.json({
            Status: "success",
            Message: "Successfully updated cart",
            cart: updatedCart,
          });
        } else {
          return res.json({ Status: "error", Message: "Failed to update cart" });
        }
      });
    } else {
      return res.json({ Status: "error", Message: "Cart not found" });
    }
  });
});

app.delete("/remove-item-to-cart", (req, res) => {
  const { productID } = req.body;

  const deleteQuery = "DELETE FROM `cart` WHERE id = ?";

  db.query(deleteQuery, [productID], (err, result) => {
    if (err) return res.json({ Status: "Error", Message: "Error in server" });

    if (result) {
      return res.json({ Status: "Success", Message: "Deleted Successfully" });
    } else {
      return res.json({ Status: "Error", Message: "Error from deleting" });
    }
  });
});

app.get("/user-address", (req, res) => {
  const { user_id } = req.query;

  const selectQuery =
    "SELECT address, contact_person, zip_code, phone_number FROM users_address WHERE user_id = ?";

  db.query(selectQuery, [user_id], (err, result) => {
    if (err) res.json({ Status: "error", Message: "Error in fetching from database" });

    return res.json({ Status: "success", Message: "fetch complete", Result: result });
  });
});

app.get("/user-delivery-address", (req, res) => {
  const { user_id } = req.query;

  const selectQuery =
    "SELECT phone_number, zip_code, deliveryAddress, contact_person FROM delivery_address WHERE user_id = ?";

  db.query(selectQuery, [user_id], (err, result) => {
    if (err) {
      return res.json({ Status: "error", Message: "Error in fetching from database" });
    }

    return res.json({
      Status: "success",
      Message: "fetch complete",
      Result: result[0],
      // Address: result[0]?.deliveryAddress,
      // ContactPerson: result[0]?.contact_person,
    });
  });
});

app.post("/update-delivery-address", (req, res) => {
  const { user_id, new_delivery_address } = req.body;

  const deliver_info = new_delivery_address.split(",");
  const [address, phoneNumber, zipCode, contactPerson] = deliver_info;

  const values = [address, zipCode, contactPerson, phoneNumber, user_id];

  const updateQuery =
    "UPDATE delivery_address SET deliveryAddress = ?, zip_code = ?, contact_person = ?, phone_number = ? WHERE user_id = ?";

  db.query(updateQuery, values, (err, result) => {
    if (err) return res.json({ Status: "error", Message: "Error in updating database" });

    if (result) {
      return res.json({ Status: "success", Message: "Success Updating" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "success", Message: "Logout" });
});

const port = 8081;
app.listen(port, () => console.log("Listening to port ", port));
