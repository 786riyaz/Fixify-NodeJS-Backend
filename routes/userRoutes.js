const express = require("express");
const User = require("../models/User");
const router = express.Router();

// GET - All Users
router.get("/allUsersData", async (req, res) => {
  try {
    const users = await User.find().select({ _id: 0, __v: 0 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

module.exports = router;
