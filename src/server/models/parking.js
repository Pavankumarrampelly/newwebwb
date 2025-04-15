const mongoose = require('mongoose');

const ParkingSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true
  },
  area: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  bookingDate: {
    type: Date
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'bus', 'other'],
    required: true
  },
  vehicleNumber: {
    type: String
  }
});

module.exports = mongoose.model('Parking', ParkingSchema);