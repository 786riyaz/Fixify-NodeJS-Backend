// backend/controllers/bookingController.js
const Booking = require("../models/Booking");

// GET ALL BOOKINGS
exports.getBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("customer_id", "name email")
    .populate("contractor_id", "name email")
    .populate("service_id", "name")
    .select("-__v");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
};

// GET SINGLE BOOKING
exports.getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("customer_id", "name email")
    .populate("contractor_id", "name email")
    .populate("service_id", "name")
    .select("-__v");

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  res.status(200).json({ success: true, data: booking });
};

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  const newBooking = await Booking.create({
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  res.status(201).json({ success: true, data: newBooking });
};

// UPDATE BOOKING
exports.updateBooking = async (req, res) => {
  const updated = await Booking.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: new Date() },
    { new: true }
  );

  res.status(200).json({ success: true, data: updated });
};

// CANCEL BOOKING
exports.cancelBooking = async (req, res) => {
  const updated = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      status: "cancelled",
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: updated,
  });
};

// DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Booking removed" });
};

// ASSIGN CONTRACTOR
exports.assignContractor = async (req, res) => {
  const { contractor_id } = req.body;

  const updated = await Booking.findByIdAndUpdate(
    req.params.id,
    { contractor_id, status: "assigned", updatedAt: new Date() },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Contractor assigned",
    data: updated,
  });
};

// REJECT BOOKING (append user ID to rejected_by)
exports.rejectBooking = async (req, res) => {
  const { user_id } = req.body;

  const updated = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { rejected_by: user_id },
      status: "pending",
      updatedAt: new Date(),
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Booking rejected",
    data: updated,
  });
};

// GET BOOKINGS BY CUSTOMER
exports.getBookingsByCustomer = async (req, res) => {
  const { customerId } = req.params;

  const bookings = await Booking.find({ customer_id: customerId })
    .populate("customer_id", "name email")
    .populate("contractor_id", "name email")
    .populate("service_id", "name")
    .select("-__v");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
};

// GET BOOKINGS BY CONTRACTOR
exports.getBookingsByContractor = async (req, res) => {
  const { contractorId } = req.params;

  const bookings = await Booking.find({ contractor_id: contractorId })
    .populate("customer_id", "name email")
    .populate("contractor_id", "name email")
    .populate("service_id", "name")
    .select("-__v");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
};

// GET BOOKINGS REJECTED BY CONTRACTOR
exports.getRejectedBookingsByContractor = async (req, res) => {
  const { contractorId } = req.params;

  const bookings = await Booking.find({
    rejected_by: contractorId,   // contractor ID exists in array
  })
    .populate("customer_id", "name email")
    .populate("contractor_id", "name email")
    .populate("service_id", "name")
    .select("-__v");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
};
