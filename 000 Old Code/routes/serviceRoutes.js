const express = require("express");
const Service = require("../models/Service");

const router = express.Router();

// GET - All Services
router.get("/getAllServicesData", async (req, res) => {
  try {
    console.log("--------------------------");
    console.log("Fetching all services data");
    console.log("--------------------------");
    const services = await Service.find().select({ _id: 0, __v: 0 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching services" });
  }
});

module.exports = router;
