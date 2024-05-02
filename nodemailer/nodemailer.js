const nodemailer = require("nodemailer");
require("dotenv").config();
// implement nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testingperposeemail@gmail.com",
    pass: process.env.GOOGLEPASSWORD,
  },
});
module.exports = transporter;
