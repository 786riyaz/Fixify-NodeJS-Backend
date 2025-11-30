const express = require("express");
const User = require("../models/User");
const { log } = require("../utils/logger");
const router = express.Router();

router.get("/allUsersData", async (req, res) => {
  try {
    log("----------------------------------------");
    log("API HIT: /allUsersData");
    log("----------------------------------------");

    const users = await User.find().select({ _id: 0, __v: 0 });
    log(`Fetched users: ${users.length}`);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    log("ERROR in /allUsersData: " + err.message);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

module.exports = router;
