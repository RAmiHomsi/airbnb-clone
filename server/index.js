const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
const User = require("./models/user");
const Place = require("./models/place");
const Booking = require("./models/booking");
const mime = require("mime-types");
const fs = require("fs");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

require("dotenv").config();
const app = express();

const bucket = "airbnb--clone";

app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser()); //to read cookies and bring tokens
app.use(
  cors({
    credentials: true,
    origin: "https://airbnb-clone-cfkm.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.MY_S3_ACCESS_KEY,
      secretAccessKey: process.env.MY_S3_SECRET_KEY,
    },
  });
  const parts = originalFilename.split(".");
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + "." + ext;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

mongoose
  .connect(process.env.MONGO_URL)
  .then((conn) => {
    console.log("Connected to MongoDB");
    app.listen(4000, () => {
      console.log("Server is listening on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json("Hello");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

// Backend: Change the login route to '/login'
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
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        },

        (err, token) => {
          if (err) {
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res
              .cookie("token", token, {
                secure: true, //use this when the code is in production for https cookie request
                sameSite: "None", //dealing with cross-site requests and the usage of third-party cookies
                maxAge: 30 * 24 * 60 * 60 * 1000,
              })
              .json(userDoc);
          }
        }
      );
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

//to have the user logged in
app.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
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
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: "/tmp/" + newName,
  });
  const url = await uploadToS3(
    "/tmp/" + newName,
    newName,
    mime.lookup("/tmp/" + newName)
  );
  res.json(url);
});

/* const upload = multer({ dest: "uploads/" });
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
}); */

const upload = multer({ dest: "/tmp" });
app.post("/upload", upload.array("photos", 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
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

  jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
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
    jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
      if (err) throw err;
      const { id } = userData;
      res.json(await Place.find({ owner: id }));
    });
  }
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
  const token = req.cookies.token;
  const { id } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
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

app.post("/booking", (req, res) => {
  const token = req.cookies.token;
  const { place, checkIn, checkOut, numberGuest, name, phone, totalPrice } =
    req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
      if (err) throw err;
      Booking.create({
        place,
        checkIn,
        checkOut,
        maxGuests: numberGuest,
        name,
        phone,
        price: totalPrice,
        user: userData.id,
      })
        .then((doc) => {
          res.json(doc);
        })
        .catch((err) => {
          throw err;
        });
    });
  }
});

app.get("/booking", async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
      if (err) throw err;
      res.json(await Booking.find({ user: userData.id }).populate("place"));
    });
  }
});
