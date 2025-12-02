const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// REGISTER USER
router.post("/registerUser", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      avatarUrl,
      addresses,
    } = req.body;

    // --- Basic Validation ---
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "firstName, lastName, email, phone and password are required",
      });
    }

    // --- Duplication Checks ---
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    if (await User.findOne({ phone })) {
      return res
        .status(400)
        .json({ success: false, message: "Phone already registered" });
    }

    // --- Hash Password ---
    const passwordHash = await bcrypt.hash(password, 10);

    // --- Create User ---
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      role: role || "customer",
      avatarUrl: avatarUrl || null,
      addresses: Array.isArray(addresses) ? addresses : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // --- Response ---
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl,
        addresses: newUser.addresses,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// LOGIN USER
router.post("/loginUser", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// PROTECTED ROUTE
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed!",
    user: req.user,
  });
});

module.exports = router;
