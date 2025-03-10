const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
   propertyID: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
   ownerID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   bookingStatus: { type: String, default: "pending" },
});

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
