const passport = require("passport");
const bcrypt = require("bcrypt");
const transporter = require("../nodemailer/nodemailer");
const User = require("../models/Users");

exports.renderHome = (req, res) => {
  const loggedInByGoogle = req.isAuthenticated();
  const loggedIn = req.session.userId ? true : false;
  let isLoggedIn = false;
  if (loggedInByGoogle === true || loggedIn === true) {
    isLoggedIn = true;
  }
  // console.log(loggedInByGoogle);
  res.render("home", { isLoggedIn });
};

exports.renderSignup = (req, res) => {
  res.render("signup");
};

exports.signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with this email");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hashSync(password, 5);

    // Create a new user in the database
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Redirect to the home page after successful signup
    res.redirect("/home");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.renderLogin = (req, res) => {
  // console.log("inside");
  res.render("login");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Implement logic to retrieve the user from the database based on the provided email
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .render("login", { message: "Invalid email or password" });
  }

  const passwordMatch = await bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    return res
      .status(401)
      .render("login", { message: "Invalid email or password" });
  }

  req.session.userId = user._id;

  res.redirect("/home");
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Internal Server Error");
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.redirect("/home"); // Redirect to the home page after logout
    });
  });
};

exports.renderResetPassword = (req, res) => {
  res.render("resetPassword");
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).render("resetPassword", {
        message: "User not found with this email",
      });
    }

    // Generate a new password
    const newPassword = generateRandomPassword();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();

    // Send email with the new password
    await transporter.sendMail({
      from: "testingperposeemail@gmail.com",
      to: user.email,
      subject: "Password Reset",
      text: `Your new password is: ${newPassword}`,
    });

    // Redirect to the login page after successful password reset
    res.redirect("/login");
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Helper function to generate a random password
function generateRandomPassword() {
  const length = 10;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!$%";
  let newPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    newPassword += charset.charAt(randomIndex);
  }
  return newPassword;
}

exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallback = passport.authenticate(
  "google",
  {
    failureRedirect: "/auth/login",
  },
  (req, res) => {
    res.redirect("/");
  }
);
