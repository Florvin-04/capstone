import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
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

app.post("/register", (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const data = [email, firstName, lastName, password];

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
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const data = [email, password];
  const sql = "SELECT * FROM users WHERE email_address = ? AND password = ?";

  db.query(sql, data, (err, result) => {
    if (err) {
      return res.json({ Status: "Error", Message: "Error in Server" });
    }

    if (result.length > 0) {
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Status: "Error", Message: "Incorrect Email or Password" });
    }
  });
});

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get Products Error" });
    return res.json({ Status: "Success", Result: result });
  });
});

const port = 8081;
app.listen(port, () => console.log("Listening to port ", port));
