const Otp = require("../models/Otp");
const generateOTP = require("./generateOTP");
const sendEmail = require("./sendEmail");

module.exports = async function sendOTP(email) {
  const otp = generateOTP();

  // Save OTP
  await Otp.create({ email, otp });

  // Send OTP via email
  await sendEmail(
    email,
    "Your OTP Code",
    `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`
  );

  return otp;
};
