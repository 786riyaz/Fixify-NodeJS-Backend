// Load environment variables at the very top
require("dotenv").config();

const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// ---------- MONGOOSE CONNECTION ----------
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DatabaseName,
    });

    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    console.log(`✓ Using Database: ${process.env.DatabaseName}`);
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// ---------- USER MODEL ----------
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["customer", "contractor", "admin"] },
  avatarUrl: String,
  addresses: [
    {
      label: String,
      line1: String,
      city: String,
      postalCode: String,
      lat: Number,
      lng: Number,
    },
  ],
  createdAt: Date,
  updatedAt: Date,
});
const User = mongoose.model("User", UserSchema);

// ---------- ROUTES ----------
// Root route
app.get("/", (req, res) => {
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log("Client IP:", clientIP);
  res.send("Hello World!");
});

// Fetch all users
app.get("/allUsersData", async (req, res) => {
  try {
    const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("Client IP:", clientIP);
    console.log("Fetching all users data...");

    // const users = await User.find();
    const users = await User.find().select({ _id: 0, __v: 0 });
    // const users = await User.find().select({ _id: 0, passwordHash: 0, __v: 0 });

    res.status(200).json({
      success: true,
      clientIP: clientIP, // optional: send to user
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
});

// ---------- REGISTER USER API ----------
const bcrypt = require("bcrypt");

// POST - Register User
/*
{
  "name": "Riyaz Khan",
  "email": "riyaz@test.com",
  "phone": "9999999999",
  "password": "123456",
  "role": "customer"
}

*/
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // --- VALIDATION ---
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // --- CHECK IF EMAIL EXISTS ---
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // --- CHECK IF PHONE EXISTS ---
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // --- HASH PASSWORD ---
    const passwordHash = await bcrypt.hash(password, 10);

    // --- CREATE USER ---
    const newUser = new User({
      name,
      email,
      phone,
      passwordHash,
      role: role || "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ---------- LOGIN USER API ----------
/*
{
  "emailOrPhone": "riyaz@test.com",
  "password": "123456"
}
{
  "emailOrPhone": "9999999999",
  "password": "123456"
}
*/
app.post("/loginUser", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // --- VALIDATION ---
    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and password are required",
      });
    }

    // --- FIND USER BY EMAIL OR PHONE ---
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // --- COMPARE PASSWORD ---
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // --- GENERATE JWT TOKEN ---
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // --- SUCCESS RESPONSE ---
    return res.status(200).json({
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
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});


/*
Authorization: Bearer <your_jwt_token>
axios.get("/profile", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

*/
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Protected route accessed!",
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// Start server
app.listen(port, () => {
  console.log(`✓ Server running at http://localhost:${port}`);
});
