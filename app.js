require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const googleAuth = require("./models/googleAuth");

const crypto = require("crypto");
const secretKey = crypto.randomBytes(32).toString("hex");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/authentications", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || secretKey,
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", authRoutes);

// Define a route handler for the root URL
app.get("/", (req, res) => {
  res.render("home"); // Renders views/home.ejs
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
