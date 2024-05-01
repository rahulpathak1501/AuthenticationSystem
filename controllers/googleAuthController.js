const passport = require("passport");

exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallback = passport.authenticate("google", {
  successRedirect: "/home",
  failureRedirect: "/login",
});
