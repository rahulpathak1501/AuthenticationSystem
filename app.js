require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const googleAuth = require("./models/googleAuth");
const path = require("path");

const crypto = require("crypto");
const secretKey = crypto.randomBytes(32).toString("hex");

const app = express();

// Connect to MongoDB
const uri = `mongodb+srv://rahul1501:${process.env.MONGODB_PASSWORD}@cluster0.du6vlta.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set the view engine to use EJS
app.set("view engine", "ejs");

// Specify the directory where EJS files are located (change "views" to your directory name)
app.set("views", path.join(__dirname, "views"));

// Express Session
app.use(
  session({
    secret: secretKey,
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
