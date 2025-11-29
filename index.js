// Load environment variables at the very top
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

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
const port = process.env.PORT || 3000;

// ---------- USER MODEL ----------
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  age: Number,
});

const User = mongoose.model("User", UserSchema);

// ---------- ROUTES ----------
app.get("/", (req, res) => {
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log("Client IP:", clientIP);
  res.send("Hello World!");
});

// Fetch all users
app.get("/allUsersData", async (req, res) => {
  try {
    console.log("Fetching all users data...");
    // const users = await User.find().select({_id: 0});
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      //   users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
});

app.get("/allUsersData", async (req, res) => {
  try {
    const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("Client IP:", clientIP);
    console.log("Fetching all users data...");

    const users = await User.find().select({_id: 0});
    // const users = await User.find();

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

// Start server
app.listen(port, () => {
  console.log(`✓ Server running at http://localhost:${port}`);
});
