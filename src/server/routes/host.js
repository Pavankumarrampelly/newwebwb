const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // You can replace this later if needed

// @route   POST api/auth/verify-host
// @desc    Accept any non-empty host ID for testing
// @access  Public
router.post('/verify-host', async (req, res) => {
  try {
    const { hostId } = req.body;

    if (hostId && hostId.trim() !== '') {
      return res.json({ success: true });
    }

    return res.status(400).json({ msg: 'Host ID is required' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// All routes below this point require auth
router.get('/food/items/all', auth, async (req, res) => {
  try {
    const { FoodItem } = require('../models/food');
    const items = await FoodItem.find().sort({ category: 1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/food/items', auth, async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, image } = req.body;
    const { FoodItem } = require('../models/food');

    const newItem = new FoodItem({
      name,
      description,
      price,
      category,
      isAvailable,
      image
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/food/items/:id', auth, async (req, res) => {
  try {
    const { FoodItem } = require('../models/food');
    const item = await FoodItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Food item not found' });
    }

    await item.remove();
    res.json({ msg: 'Food item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.patch('/food/items/:id/toggle', auth, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const { FoodItem } = require('../models/food');
    const item = await FoodItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Food item not found' });
    }

    item.isAvailable = isAvailable;
    await item.save();

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/food/orders/all', auth, async (req, res) => {
  try {
    const { FoodOrder } = require('../models/food');
    const orders = await FoodOrder.find()
      .sort({ orderDate: -1 })
      .populate('user', ['name', 'email'])
      .populate('items.item')
      .populate('eventId', ['title', 'date']);

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.patch('/food/orders/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const { FoodOrder } = require('../models/food');
    const order = await FoodOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/parking/all', auth, async (req, res) => {
  try {
    const Parking = require('../models/parking');
    const slots = await Parking.find().sort({ area: 1, slotNumber: 1 });
    res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/parking/slots', auth, async (req, res) => {
  try {
    const { slotNumber, area, vehicleType } = req.body;
    const Parking = require('../models/parking');

    const existingSlot = await Parking.findOne({ slotNumber });
    if (existingSlot) {
      return res.status(400).json({ msg: 'Slot number already exists' });
    }

    const newSlot = new Parking({
      slotNumber,
      area,
      vehicleType
    });

    const slot = await newSlot.save();
    res.json(slot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/parking/slots/:id', auth, async (req, res) => {
  try {
    const Parking = require('../models/parking');
    const slot = await Parking.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ msg: 'Parking slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ msg: 'Cannot delete booked slot' });
    }

    await slot.remove();
    res.json({ msg: 'Parking slot removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/parking/bookings', auth, async (req, res) => {
  try {
    const Parking = require('../models/parking');
    const bookings = await Parking.find({ isBooked: true })
      .populate('bookedBy', ['name', 'email'])
      .populate('eventId', ['title', 'date']);

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/parking/bookings/:id', auth, async (req, res) => {
  try {
    const Parking = require('../models/parking');
    const booking = await Parking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    booking.isBooked = false;
    booking.bookedBy = null;
    booking.eventId = null;
    booking.bookingDate = null;
    booking.vehicleNumber = null;

    await booking.save();

    res.json({ msg: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/events/:id/registrations', auth, async (req, res) => {
  try {
    const Event = require('../models/event');
    const event = await Event.findById(req.params.id)
      .populate('attendees', ['name', 'email', 'collegeId']);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    const registrations = event.attendees.map(attendee => ({
      _id: attendee._id,
      user: attendee,
      eventId: event._id,
      registeredAt: attendee._id.getTimestamp()
    }));

    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
