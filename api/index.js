const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
const User = require("./models/user");
const Place = require("./models/place");
const download = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

require("dotenv").config();
const app = express();

const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";

app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
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

app.post("/uploadlink", async (req, res) => {
  const { link } = req.body;
  const newName = "Photo" + Date.now() + ".jpg";

  await download.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newpath = path + "." + ext;
    fs.renameSync(path, newpath);
    uploadedFiles.push(newpath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      price,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const places = await Place.find({ owner: userData.id });
      res.json(places);
    });
  }
});

app.get("/places/:id", async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const place = await Place.findById(req.params.id);
      res.json(place);
    });
  }
});

app.put("/places", async (req, res) => {
  const token = req.cookies.token;
  const { id } = req.body;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;

      const place = await Place.findById(id);
      if (userData.id === place.owner.toString()) {
        place.title = req.body.title;
        place.address = req.body.address;
        place.description = req.body.description;
        place.perks = req.body.perks;
        place.extraInfo = req.body.extraInfo;
        place.checkIn = req.body.checkIn;
        place.checkOut = req.body.checkOut;
        place.maxGuests = req.body.maxGuests;
        place.photos = req.body.addedPhotos;
        place.price = req.body.price;
        await place.save();
        res.json(place);
      }
    });
  }
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});
