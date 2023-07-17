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
    methods: ["POST", "GET", "DELETE", "PUT"],
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

app.post("/register", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    const selectQuery = "SELECT * FROM users WHERE email_address = ?";
    const selectResult = await executeQuery(selectQuery, [email]);

    if (selectResult.length > 0) {
      return res.json({ Status: "error", Message: "Email address already exists" });
    }

    const insertQuery =
      "INSERT INTO users (email_address, first_name, last_name, password) VALUES (?)";

    bcrypt.hash(password.toString(), salt, async (err, hashPassword) => {
      const data = [email, firstName, lastName, hashPassword];

      if (err) {
        return res.json({ Status: "error", Message: "Error in hashing password" });
      }
      const insertResult = await executeQuery(insertQuery, data);

      if (insertResult) {
        return res.json({ Status: "success", Message: "User Created" });
      }
      return res.json({ Status: "success", Message: "error in creating user" });

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
  } catch (error) {
    return res.json({ Status: "error", Message: error.error });
  }

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

// app.post("/register", (req, res) => {
//   const { email, firstName, lastName, password } = req.body;

//   const emailCheckQuery = "SELECT * FROM users WHERE email_address = ?";

//   db.query(emailCheckQuery, [email], (err, result) => {
//     if (err) {
//       return res.json({ Status: "error", Message: "Error in server" });
//     }

//     if (result.length > 0) {
//       return res.json({ Status: "error", Message: "Email address already exists" });
//     }

//     const sql =
//       "INSERT INTO users (email_address, first_name, last_name, password) VALUES (?,?,?,?)";

//     bcrypt.hash(password.toString(), salt, (err, hashPassword) => {
//       const data = [email, firstName, lastName, hashPassword];

//       if (err) {
//         return res.json({ Status: "error", Message: "Error in hashing password" });
//       }
//       db.query(sql, data, (err, result) => {
//         if (err) {
//           return res.json({ Status: "error", Message: "error in server" });
//         }

//         if (result) {
//           return res.json({ Status: "success", Message: "User Created" });
//         } else {
//           return res.json({ Status: "success", Message: "error in creating user" });
//         }
//       });
//     });

//     // const sql =
//     //   "INSERT INTO users (email_address, first_name, last_name, password) VALUES (?,?,?,?)";

//     // db.query(sql, data, (err, result) => {
//     //   if (err) {
//     //     return res.json({ Status: "error", Message: "error in server" });
//     //   }
//     //   if (result) {
//     //     return res.json({ Status: "success", Message: "User Created" });
//     //   } else {
//     //     return res.json({ Status: "success", Message: "error in creating user" });
//     //   }
//     // });
//   });
// });

// for hash pass
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   // const data = [email, password];
//   // const sql = "SELECT * FROM users WHERE email_address = ?";

//   try {
//     const selectQuery = "SELECT * FROM users WHERE email_address = ?";
//     const selectResult = await executeQuery(selectQuery, [email]);

//     console.log(selectResult);
//     if (selectResult.length > 0) {
//       bcrypt.compare(password.toString(), selectResult[0].password, async (err, response) => {
//         if (err) return res.json({ Status: "error", Message: "error in server" });

//         if (response) {
//           const first_name = selectResult[0].first_name;
//           const last_name = selectResult[0].last_name;
//           const id = selectResult[0].id;
//           const token = jwt.sign({ first_name, last_name, id }, "jwt-sample-secret-key", {
//             expiresIn: "1d",
//           });
//           res.cookie("token", token, {
//             sameSite: "None",
//             secure: true, // Make sure to set secure to true if using HTTPS
//           });
//           return res.json({ Status: "success", Message: "Logged In" });
//         } else {
//           return res.json({ Status: "error", Message: "Incorrect Password" });
//         }
//       });
//     }

//     return res.json({ Status: "Error", Message: "No Email existed" });
//   } catch (error) {
//     return res.json({ Status: "error", Message: error.error });
//   }

//   // db.query(sql, email, (err, result) => {
//   //   if (err) {
//   //     return res.json({ Status: "error", Message: "Error in Server" });
//   //   }

//   //   if (result.length > 0) {
//   //     bcrypt.compare(password.toString(), result[0].password, (err, response) => {
//   //       if (err) return res.json({ Status: "error", Message: "error in server" });

//   //       if (response) {
//   //         const first_name = result[0].first_name;
//   //         const last_name = result[0].last_name;
//   //         const id = result[0].id;
//   //         const token = jwt.sign({ first_name, last_name, id }, "jwt-sample-secret-key", {
//   //           expiresIn: "1d",
//   //         });
//   //         res.cookie("token", token, {
//   //           sameSite: "None",
//   //           secure: true, // Make sure to set secure to true if using HTTPS
//   //         });
//   //         return res.json({ Status: "success", Message: "Logged In" });
//   //       } else {
//   //         return res.json({ Status: "error", Message: "Incorrect Password" });
//   //       }
//   //     });
//   //   } else {
//   //     return res.json({ Status: "Error", Message: "No Email existed" });
//   //   }
//   // });
// });

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

app.get("/cart", async (req, res) => {
  const { user_id } = req.query;

  try {
    const selectQuery =
      "SELECT c.id, added_at, c.product_id, c.user_id, c.quantity, p.title, p.category, p.image, p.price FROM cart as c JOIN users as u ON c.user_id = u.id JOIN products as p ON p.id = c.product_id WHERE c.user_id = ? ORDER BY `c`.`added_at` DESC";

    const selectResult = await executeQuery(selectQuery, [user_id]);

    if (selectResult) {
      return res.json({
        Status: "success",
        Message: "fetch completed",
        id: user_id,
        Result: selectResult,
      });
    }
  } catch (error) {
    return res.json({ Status: "error", Message: error.message });
  }

  // const sql =
  //   "SELECT c.id, added_at, c.product_id, c.user_id, c.quantity, p.title, p.category, p.image, p.price FROM cart as c JOIN users as u ON c.user_id = u.id JOIN products as p ON p.id = c.product_id WHERE c.user_id = ? ORDER BY `c`.`added_at` DESC";

  // db.query(sql, [user_id], (err, result) => {
  //   if (err) return res.json({ Status: "error", Message: "Error in server" });
  //   return res.json({ Status: "success", Message: "fetch completed", id: user_id, Result: result });
  // });
});
// app.get("/cart", (req, res) => {
//   const { user_id } = req.query;

//   const sql =
//     "SELECT c.id, added_at, c.product_id, c.user_id, c.quantity, p.title, p.category, p.image, p.price FROM cart as c JOIN users as u ON c.user_id = u.id JOIN products as p ON p.id = c.product_id WHERE c.user_id = ? ORDER BY `c`.`added_at` DESC";

//   db.query(sql, [user_id], (err, result) => {
//     if (err) return res.json({ Status: "error", Message: "Error in server" });
//     return res.json({ Status: "success", Message: "fetch completed", id: user_id, Result: result });
//   });
// });

app.post("/add-to-cart", async (req, res) => {
  const { product_id, user_id, quantity } = req.body;
  const selectValues = [product_id, user_id];
  const insertValues = [product_id, user_id, quantity];

  try {
    const selectQuery = "SELECT * FROM cart WHERE product_id = ? AND user_id = ?";
    const selectResult = await executeQuery(selectQuery, [...selectValues]);

    if (selectResult.length > 0) {
      const updateQuery = `UPDATE cart SET quantity = ? WHERE product_id = ? AND user_id = ?`;

      const updateValues = [...[selectResult[0].quantity + Number(quantity)], ...selectValues];
      const updateResult = await executeQuery(updateQuery, updateValues);

      if (updateResult) {
        return res.json({ Status: "success", Message: "success updating" });
      }
    }

    const insertQuery = "INSERT INTO cart (product_id, user_id, quantity) VALUES (?)";
    const insertResult = await executeQuery(insertQuery, [insertValues]);

    if (insertResult) {
      return res.json({ Status: "success", Message: "success inserting" });
    }
  } catch (error) {
    return res.json({ Status: "error", Message: error.message });
  }

  //   const checkQuery = "SELECT * FROM cart WHERE product_id = ? AND user_id = ?";

  //   db.query(checkQuery, [...selectValues], (err, result) => {
  //     if (err) return res.json({ Status: "error", Message: "Error in checking cart" });
  //     if (result.length > 0) {
  //       // const updateQuery = `UPDATE cart SET quantity = ${result[0].quantity} + ${quantity} WHERE product_id = ? AND user_id = ?`;
  //       const updateQuery = `UPDATE cart SET quantity = ? WHERE product_id = ? AND user_id = ?`;
  //       const updateValues = [...[result[0].quantity + Number(quantity)], ...selectValues];

  //       db.query(updateQuery, updateValues, (err, result) => {
  //         if (err) return res.json({ Status: "error", Message: "Error in server" });

  //         if (result) return res.json({ Status: "success", Message: "success updating" });
  //       });
  //     } else {
  //       const insertQuery = "INSERT INTO cart (product_id, user_id, quantity) VALUES (?)";
  //       db.query(insertQuery, [insertValues], (err, result) => {
  //         if (err) return res.json({ Status: "error", Message: "Error in server" });

  //         if (result) return res.json({ Status: "success", Message: "success inserting" });
  //       });
  //     }
  //   });
});

// app.post("/add-to-cart", (req, res) => {
//   const { product_id, user_id, quantity } = req.body;

//   const checkQuery = "SELECT * FROM cart WHERE product_id = ? AND user_id = ?";

//   db.query(checkQuery, [product_id, user_id], (err, result) => {
//     if (err) return res.json({ Status: "error", Message: "Error in checking cart" });
//     if (result.length > 0) {
//       // const updateQuery = `UPDATE cart SET quantity = ${result[0].quantity} + ${quantity} WHERE product_id = ? AND user_id = ?`;
//       const updateQuery = `UPDATE cart SET quantity = ? WHERE product_id = ? AND user_id = ?`;

//       db.query(
//         updateQuery,
//         [[result[0].quantity + Number(quantity)], product_id, user_id],
//         (err, result) => {
//           if (err) return res.json({ Status: "error", Message: "Error in server" });

//           if (result) return res.json({ Status: "success", Message: "success updating" });
//         }
//       );
//     } else {
//       const insertQuery = "INSERT INTO cart (product_id, user_id, quantity) VALUES (?, ?, ?)";
//       db.query(insertQuery, [product_id, user_id, quantity], (err, result) => {
//         if (err) return res.json({ Status: "error", Message: "Error in server" });

//         if (result) return res.json({ Status: "success", Message: "success inserting" });
//       });
//     }
//   });
// });

app.post("/update-cart", async (req, res) => {
  const { cartID, quantity, action } = req.body;

  // const selectQuery = "SELECT * FROM cart WHERE id = ?";

  try {
    const selectQuery = "SELECT * FROM cart WHERE id = ?";

    const selectResult = await executeQuery(selectQuery, [cartID]);

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

      const updateValues = [updatedQuantity, cartID];
      const updateResult = await executeQuery(updateQuery, updateValues);

      if (updateResult) {
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
      }

      return res.json({ Status: "error", Message: "Failed to update cart" });
    }
  } catch (error) {
    return res.json({ Status: "error", Message: error.message });
  }
});

// app.post("/update-cart", (req, res) => {
//   const { cartID, quantity, action } = req.body;

//   const selectQuery = "SELECT * FROM cart WHERE id = ?";

//   db.query(selectQuery, [cartID], (err, selectResult) => {
//     if (err) {
//       console.error("Error retrieving cart:", err);
//       return res.json({ Status: "error", Message: "Error in server" });
//     }

//     if (selectResult.length > 0) {
//       let updatedQuantity;
//       const currentQuantity = selectResult[0].quantity;

//       if (action === "update") {
//         updatedQuantity = Number(quantity);
//       } else if (action === "add") {
//         updatedQuantity = currentQuantity + 1;
//       } else if (action === "subtract") {
//         updatedQuantity = currentQuantity - 1;
//       } else {
//         return res.json({ Status: "error", Message: "Invalid action" });
//       }

//       const updateQuery = "UPDATE cart SET quantity = ? WHERE id = ?";
//       const values = [updatedQuantity, cartID];

//       db.query(updateQuery, values, (err, updateResult) => {
//         if (err) {
//           console.error("Error updating cart:", err);
//           return res.json({ Status: "error", Message: "Error in server" });
//         }

//         if (updateResult.affectedRows > 0) {
//           const updatedCart = {
//             ...selectResult[0],
//             quantity: updatedQuantity,
//             action,
//           };
//           return res.json({
//             Status: "success",
//             Message: "Successfully updated cart",
//             cart: updatedCart,
//           });
//         } else {
//           return res.json({ Status: "error", Message: "Failed to update cart" });
//         }
//       });
//     } else {
//       return res.json({ Status: "error", Message: "Cart not found" });
//     }
//   });
// });

app.delete("/remove-item-to-cart", async (req, res) => {
  const { productID } = req.body;

  try {
    const deleteQuery = "DELETE FROM `cart` WHERE id = ?";

    const deleteResult = await executeQuery(deleteQuery, [productID]);

    if (deleteResult) {
      return res.json({ Status: "Success", Message: "Deleted Successfully" });
    }

    return res.json({ Status: "Error", Message: "Error from deleting" });
  } catch (error) {
    return res.json({ Status: "error", Message: error.message });
  }
});

app.get("/user-address", async (req, res) => {
  const { user_id } = req.query;
  try {
    const selectQuery =
      "SELECT id, address, contact_person, zip_code, phone_number FROM users_address WHERE user_id = ?";

    const selectResult = await executeQuery(selectQuery, [user_id]);

    if (selectResult) {
      return res.json({ Status: "success", Message: "fetch complete", Result: selectResult });
    }
  } catch (error) {
    return res.json({ Status: "error", Message: error.message });
  }
});

// app.get("/user-address", (req, res) => {
//   const { user_id } = req.query;

//   const selectQuery =
//     "SELECT id, address, contact_person, zip_code, phone_number FROM users_address WHERE user_id = ?";

//   db.query(selectQuery, [user_id], (err, result) => {
//     if (err) res.json({ Status: "error", Message: "Error in fetching from database" });

//     return res.json({ Status: "success", Message: "fetch complete", Result: result });
//   });
// });

app.get("/user-delivery-address", async (req, res) => {
  const { user_id } = req.query;

  // const selectQuery =
  //   "SELECT phone_number, zip_code, deliveryAddress, contact_person FROM delivery_address WHERE user_id = ?";
  try {
    const selectQuery =
      "SELECT phone_number, zip_code, deliveryAddress, contact_person FROM delivery_address WHERE user_id = ?";

    const selectResult = await executeQuery(selectQuery, [user_id]);

    if (selectResult.length > 0) {
      return res.json({
        Status: "success",
        Message: "Success Fetching has result",
        Result: selectResult[0],
      });
    } else {
      return res.json({
        Status: "no result",
        Message: "Success Fetching no result",
        Result: selectResult.length,
      });
    }
  } catch (error) {
    return res.json({ Status: "error", Message: error.message });
  }
});

// app.get("/user-delivery-address", (req, res) => {
//   const { user_id } = req.query;

//   const selectQuery =
//     "SELECT phone_number, zip_code, deliveryAddress, contact_person FROM delivery_address WHERE user_id = ?";

//   db.query(selectQuery, [user_id], (err, result) => {
//     if (err) {
//       return res.json({ Status: "error", Message: "Error in fetching from database" });
//     }

//     if (result.length > 0) {
//       return res.json({
//         Status: "success",
//         Message: "Success Fetching has result",
//         Result: result[0],
//       });
//     } else {
//       return res.json({
//         Status: "no result",
//         Message: "Success Fetching no result",
//         Result: result.length,
//       });
//     }
//   });
// });

app.post("/add-update-address", async (req, res) => {
  const { userID, contactPerson, zipCode, phoneNumber, address, formState } = req.body;
  const insertValues = [userID, address, zipCode, phoneNumber, contactPerson];
  const updateValues = [address, zipCode, phoneNumber, contactPerson, formState.id];

  try {
    if (formState.status === "newAddress") {
      const selectQuery = "SELECT * FROM users_address WHERE user_id = ?";
      const selectResult = await executeQuery(selectQuery, [userID]);

      if (selectResult.length < 5) {
        const insertQuery =
          "INSERT INTO users_address(user_id, address, zip_code, phone_number, contact_person) VALUES (?)";
        const insertResult = await executeQuery(insertQuery, [insertValues]);

        if (insertResult) {
          return res.json({ Status: "success", Message: "Inserting Complete" });
        }

        return res.json({ Status: "error", Message: "Inserting error" });
      }

      return res.json({ Status: "error", Message: "Cannot add more than 5 address" });
    }

    if (formState.status === "editAddress") {
      const updateQuery =
        "UPDATE users_address SET address = ?, zip_code = ?, phone_number = ?, contact_person = ? WHERE id = ?";
      const updateResult = await executeQuery(updateQuery, updateValues);

      if (updateResult) {
        return res.json({ Status: "success", Message: "Updated Successfully" });
      }

      return res.json({ Status: "error", Message: "Updating error" });
    }
  } catch (error) {
    return res.json({ Status: "error", Message: error.message });
  }
});

// app.post("/add-update-address", async (req, res) => {
//   const { userID, contactPerson, zipCode, phoneNumber, address, formState } = req.body;
//   const insertValues = [userID, address, zipCode, phoneNumber, contactPerson];
//   const updateValues = [address, zipCode, phoneNumber, contactPerson, formState.id];

//   if (formState.status === "newAddress") {
//     const selectQuery = "SELECT * FROM users_address WHERE user_id = ?";

//     db.query(selectQuery, [userID], (err, result) => {
//       if (err) return res.json({ Status: "error", Message: "fetching error in database" });
//       if (result.length < 5) {
//         const insertQuery =
//           "INSERT INTO users_address(user_id, address, zip_code, phone_number, contact_person) VALUES (?)";

//         db.query(insertQuery, [insertValues], (err, result) => {
//           if (err) return res.json({ Status: "error", Message: "Inserting error in database" });

//           return res.json({ Status: "success", Message: "Inserting Complete" });
//         });
//       } else {
//         return res.json({ Status: "error", Message: "Cannot add more than 5 address" });
//       }
//     });
//   }

//   if (formState.status === "editAddress") {
//     const updateQuery =
//       "UPDATE users_address SET address = ?, zip_code = ?, phone_number = ?, contact_person = ? WHERE id = ?";

//     db.query(updateQuery, updateValues, (err, result) => {
//       if (err) return res.json({ Status: "error", Message: "Updating error from server" });

//       return res.json({ Status: "success", Message: "Updated Successfully" });
//     });
//   }
// });

app.post("/add-update-delivery-address", async (req, res) => {
  const { user_id, new_delivery_address } = req.body;

  const deliver_info = new_delivery_address.split(",");
  const [address, phoneNumber, zipCode, contactPerson] = deliver_info;

  const uppdateValues = [address, zipCode, contactPerson, phoneNumber, user_id];
  const insertValues = [user_id, address, zipCode, contactPerson, phoneNumber];

  try {
    const selectQuery = "SELECT * FROM delivery_address WHERE user_id = ?";
    const selectResult = await executeQuery(selectQuery, [user_id]);

    if (selectResult.length > 0) {
      const updateQuery =
        "UPDATE delivery_address SET deliveryAddress = ?, zip_code = ?, contact_person = ?, phone_number = ? WHERE user_id = ?";
      const updateResult = await executeQuery(updateQuery, uppdateValues);

      if (updateResult) return res.json({ Status: "success", Message: "Success Updating" });
      else return res.json({ Status: "error", Message: "uupdate error" });
    }

    const insertQuery =
      "INSERT INTO `delivery_address`(user_id, deliveryAddress, zip_code, contact_person, phone_number) VALUES (?)";
    const insertResult = await executeQuery(insertQuery, [insertValues]);

    if (insertResult) return res.json({ Status: "success", Message: "insert successfully" });
  } catch (error) {
    return res.json({ Status: "error", Message: error.message });
  }
});

// app.post("/add-update-delivery-address", (req, res) => {
//   const { user_id, new_delivery_address } = req.body;

//   const deliver_info = new_delivery_address.split(",");
//   const [address, phoneNumber, zipCode, contactPerson] = deliver_info;

//   const uppdateValues = [address, zipCode, contactPerson, phoneNumber, user_id];
//   const insertValues = [user_id, address, zipCode, contactPerson, phoneNumber];

//   const selectQuery = "SELECT * FROM delivery_address WHERE user_id = ?";

//   db.query(selectQuery, [user_id], (err, result) => {
//     if (err) return { Status: "error", Message: "error in fetching from database" };

//     if (result.length > 0) {
//       const updateQuery =
//         "UPDATE delivery_address SET deliveryAddress = ?, zip_code = ?, contact_person = ?, phone_number = ? WHERE user_id = ?";

//       db.query(updateQuery, uppdateValues, (err, result) => {
//         if (err) return res.json({ Status: "error", Message: "Error in updating database" });

//         if (result) {
//           return res.json({ Status: "success", Message: "Success Updating" });
//         }
//       });
//     } else {
//       const insertQuery =
//         "INSERT INTO `delivery_address`(user_id, deliveryAddress, zip_code, contact_person, phone_number) VALUES (?)";

//       db.query(insertQuery, [insertValues], (err, result) => {
//         if (err) return res.json({ Status: "error", Message: "Error in inserting from database" });

//         return res.json({ Status: "success", Message: "insert successfully" });
//       });
//     }
//   });
// });

function generateUniqueIDWithNano() {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1; // Months are zero-based
  var day = currentDate.getDate();

  // Format the values to ensure they have leading zeros if necessary
  var formattedMonth = month < 10 ? "0" + month : month;
  var formattedDay = day < 10 ? "0" + day : day;

  // Concatenate the formatted values to create the base ID
  var baseID = year + formattedMonth + formattedDay;

  // Retrieve high-resolution timestamp
  var nano = performance.now();

  // Convert to string and remove the dot
  var nanoString = nano.toString().replace(".", "");

  // Combine the base ID with the nanoseconds to create the unique ID
  var uniqueID = baseID + nanoString;

  return uniqueID;
}

app.get("/orders", async (req, res) => {
  const { user_id } = req.query;

  try {
    const selectQuery = "SELECT * FROM `orders` WHERE user_id = ?";
    const result = await executeQuery(selectQuery, [user_id]);

    return res.json({ Status: "success", Message: "fetched successfully", Result: result });
  } catch (error) {
    return res.json({ Status: "error", Message: error.message });
  }
});

app.post("/place-order", async (req, res) => {
  const { items, addressInfo } = req.body;
  const { address, zipCode, contactPerson, phoneNumber } = addressInfo;

  try {
    for (const item of items) {
      const selectQuery = "SELECT * FROM cart WHERE id = ?";
      const result = await executeQuery(selectQuery, [item]);

      if (result.length > 0) {
        const { id, product_id, user_id, quantity } = result[0];
        const insertValues = [
          generateUniqueIDWithNano(),
          product_id,
          user_id,
          quantity,
          `${address} ${zipCode}`,
          phoneNumber,
          contactPerson,
        ];

        const insertQuery =
          "INSERT INTO orders (order_id, product_id, user_id, quantity, delivery_address, phone_number, contact_person) VALUES (?)";
        await executeQuery(insertQuery, [insertValues]);

        const deleteQuery = "DELETE FROM cart WHERE id = ?";
        await executeQuery(deleteQuery, [id]);
      }
    }

    return res.json({ Status: "success", Message: "inserted successfully" });
  } catch (error) {
    return res.json({ Status: "error", Message: "error occurred" });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "success", Message: "Logout" });
});

function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        const errorDetails = {
          status: "error",
          message: "Error executing database query",
          error: err,
        };
        reject(errorDetails);
      } else {
        resolve(result);
      }
    });
  });
}
const port = 8081;
app.listen(port, () => console.log("Listening to port ", port));
