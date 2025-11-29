const mongoose = require("mongoose");

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

module.exports = connectDB;
