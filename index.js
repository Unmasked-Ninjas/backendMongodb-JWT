const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const jwtpassword = "123456";

app.use(express.json());

const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://prasanna:ikekval@prasanna.hmhxb.mongodb.net/testdb")
  .then(() => {
    console.log("Connected successfully");
  })
  .catch(() => {
    console.log("Error connecting to the database");
  });

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("Users", schema);

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    var token = jwt.sign({ email: email }, jwtpassword);
    return res.json({
      token,
    });
  }

  // User.findOne({ email: email })
  //   .then((user) => {
  //     if (user) {
  //       // If user exists, respond with a message
  //       return res.status(409).json("User already exists in a database");
  //     }
  const newuser = new User({
    name,
    email,
    password,
  });
  newuser
    .save()
    .then(() => {
      res.status(201).json("user created successfully");
    })
    .catch(() => {
      res.json("Invalid credentials");
    });
});

app.get("/users", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, jwtpassword);
    const decEmail = decoded.email;
    const users = await User.find({ email: { $ne: decEmail } });
    res.json({
      users,
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000);
