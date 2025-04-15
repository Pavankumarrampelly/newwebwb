const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Parking = require('../models/parking');

// @route   GET api/parking
// @desc    Get all parking slots
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const slots = await Parking.find().sort({ slotNumber: 1 });
    res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/parking/available
// @desc    Get available parking slots
// @access  Private
router.get('/available', auth, async (req, res) => {
  try {
    const slots = await Parking.find({ isBooked: false }).sort({ slotNumber: 1 });
    res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/parking/user
// @desc    Get user's booked parking slots
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const slots = await Parking.find({ bookedBy: req.user.id }).populate('eventId', ['title', 'date']);
    res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/parking/book/:id
// @desc    Book a parking slot
// @access  Private
router.post('/book/:id', auth, async (req, res) => {
  try {
    const { eventId, vehicleNumber } = req.body;
    
    const slot = await Parking.findById(req.params.id);
    
    if (!slot) {
      return res.status(404).json({ msg: 'Parking slot not found' });
    }
    
    if (slot.isBooked) {
      return res.status(400).json({ msg: 'Parking slot already booked' });
    }
    
    slot.isBooked = true;
    slot.bookedBy = req.user.id;
    slot.eventId = eventId;
    slot.bookingDate = new Date();
    slot.vehicleNumber = vehicleNumber;
    
    await slot.save();
    
    res.json(slot);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Parking slot not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/parking/cancel/:id
// @desc    Cancel parking slot booking
// @access  Private
router.delete('/cancel/:id', auth, async (req, res) => {
  try {
    const slot = await Parking.findById(req.params.id);
    
    if (!slot) {
      return res.status(404).json({ msg: 'Parking slot not found' });
    }
    
    if (!slot.isBooked) {
      return res.status(400).json({ msg: 'Parking slot is not booked' });
    }
    
    if (slot.bookedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to cancel this booking' });
    }
    
    slot.isBooked = false;
    slot.bookedBy = null;
    slot.eventId = null;
    slot.bookingDate = null;
    slot.vehicleNumber = null;
    
    await slot.save();
    
    res.json({ msg: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Parking slot not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;