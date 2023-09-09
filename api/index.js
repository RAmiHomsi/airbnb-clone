const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
const User = require("./models/user");
const e = require("express");

require("dotenv").config();
const app = express();

const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";

app.use(express.json());
app.use(cookieParser()); //to read cookies and bring tokens
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then((conn) => {
    console.log("Connected to MongoDB: " + conn.connection.host);
  })
  .then(() => {
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password,
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});

//to have the user logged in
app.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, decoded) => {
      if (err) throw err;
      const { email, name, _id } = await User.findById(decoded.id);
      res.json({ email, name, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});
