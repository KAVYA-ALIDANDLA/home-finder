const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  propertyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Ensure this is correctly set when booking is created
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'], // Make sure 'Pending' is included here
  default: 'Pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
