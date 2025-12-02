const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
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

module.exports = mongoose.model("User", UserSchema);
