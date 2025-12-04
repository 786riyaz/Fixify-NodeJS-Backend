const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",        // customer reference
      required: true,
    },

    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",     // service reference
      required: true,
    },

    contractor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",        // contractor reference
      default: null,
    },

    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    rejected_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",      // IDs of customer or contractor who rejected
      }
    ],

    issue_images: [
      {
        type: String,     // store image URLs or filenames
      }
    ],

    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
        "rejected"
      ],
      default: "pending",
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
