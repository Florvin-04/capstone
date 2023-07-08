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
    methods: ["POST", "GET"],
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

    req.name = decoded.name;
    req.id = decoded.id;
    next();
  });
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "success", Message: "Authorized", name: req.name, id: req.id });
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
          const name = result[0].first_name;
          const id = result[0].id;
          const token = jwt.sign({ name, id }, "jwt-sample-secret-key", { expiresIn: "1d" });
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

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "success", Message: "Logout" });
});

const port = 8081;
app.listen(port, () => console.log("Listening to port ", port));
