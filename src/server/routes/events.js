const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/event');
const User = require('../models/user');

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, subcategory, date, time, location, price, capacity, skills } = req.body;
    
    const newEvent = new Event({
      title,
      description,
      category,
      subcategory,
      date,
      time,
      location,
      price,
      capacity,
      skills,
      host: req.user.id
    });
    
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events
// @desc    Get all events
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('host', ['name', 'email']);
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('host', ['name', 'email']);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/category/:category
// @desc    Get events by category
// @access  Private
router.get('/category/:category', auth, async (req, res) => {
  try {
    const events = await Event.find({ category: req.params.category }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/date/:date
// @desc    Get events by date
// @access  Private
router.get('/date/:date', auth, async (req, res) => {
  try {
    // Find events for the date, using start of day and end of day
    const startDate = new Date(req.params.date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(req.params.date);
    endDate.setHours(23, 59, 59, 999);
    
    const events = await Event.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ time: 1 });
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if event is at capacity
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ msg: 'Event is at full capacity' });
    }
    
    // Check if user is already registered
    if (event.attendees.some(attendee => attendee.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Already registered for this event' });
    }
    
    // Add user to event attendees
    event.attendees.push(req.user.id);
    await event.save();
    
    // Add event to user's registered events
    const user = await User.findById(req.user.id);
    user.registeredEvents.push(event._id);
    await user.save();
    
    res.json({ event, user });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/events/:id/register
// @desc    Cancel registration for an event
// @access  Private
router.delete('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if user is registered
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.toString() === req.user.id
    );
    
    if (attendeeIndex === -1) {
      return res.status(400).json({ msg: 'Not registered for this event' });
    }
    
    // Remove user from event attendees
    event.attendees.splice(attendeeIndex, 1);
    await event.save();
    
    // Remove event from user's registered events
    const user = await User.findById(req.user.id);
    const regIndex = user.registeredEvents.findIndex(
      regEvent => regEvent.toString() === req.params.id
    );
    
    if (regIndex !== -1) {
      user.registeredEvents.splice(regIndex, 1);
      await user.save();
    }
    
    res.json({ event, user });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/user/registered
// @desc    Get all events registered by user
// @access  Private
router.get('/user/registered', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('registeredEvents');
    res.json(user.registeredEvents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/user/hosted
// @desc    Get all events hosted by user
// @access  Private
router.get('/user/hosted', auth, async (req, res) => {
  try {
    const events = await Event.find({ host: req.user.id });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;