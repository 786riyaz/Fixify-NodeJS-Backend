// backend/routes/bookingRoutes.js
const express = require("express");
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  cancelBooking,
  assignContractor,
  rejectBooking,
  getBookingsByCustomer,
  getBookingsByContractor,
  getRejectedBookingsByContractor,
} = require("../controllers/bookingController");

const router = express.Router();

// ROUTES
// router.get("/bookings", getBookings);           // Get all bookings
router.post("", createBooking);         // Create new booking
router.get("", getBookings);           // Get all bookings
router.get("/:id", getBookingById);     // Get single booking
router.put("/:id", updateBooking);      // Update booking
router.delete("/:id", deleteBooking);   // Delete booking
router.put("/:id/cancel", cancelBooking);  // Cancel booking

// Extra actions
router.put("/:id/assign", assignContractor);  // Assign contractor
router.put("/:id/reject", rejectBooking);     // Add reject entry

router.get("/customer/:customerId", getBookingsByCustomer);
router.get("/contractor/:contractorId", getBookingsByContractor);
router.get("/contractor/:contractorId/rejected", getRejectedBookingsByContractor);

module.exports = router;
  