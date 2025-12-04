const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Trying to Connecting MongoDB...");

  try {
    // const conn = await mongoose.connect(process.env.MONGODB_URI, {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DatabaseName,
    });

    // console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    console.log(`✓ MongoDB connected.`);
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
