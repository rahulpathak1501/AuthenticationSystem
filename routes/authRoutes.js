const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const googleAuthController = require("../controllers/googleAuthController");

const router = express.Router();

// router.get("/home", (req, res) => {
//   const loggedIn = req.isAuthenticated();
//   res.render("home", { loggedIn });
// });

router.get("/", authController.renderHome);
router.get("/home", authController.renderHome);

router.get("/signup", authController.renderSignup);
router.post("/signup", authController.signup);

// console.log("hi");

router.get("/login", authController.renderLogin);
router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.get("/reset-password", authController.renderResetPassword);
router.post("/reset-password", authController.resetPassword);

router.get("/google", googleAuthController.googleLogin);
router.get("/google/callback", googleAuthController.googleCallback);

module.exports = router;
