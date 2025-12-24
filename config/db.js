// config/db.js
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  console.log("Trying to connect MongoDB...");

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DatabaseName,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    console.log("✓ MongoDB connected:", conn.connection.name);
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error.message);

    // ❌ DO NOT exit the process in serverless
    throw error;
  }
};

module.exports = connectDB;
