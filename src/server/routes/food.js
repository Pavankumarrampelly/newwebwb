const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { FoodItem, FoodOrder } = require('../models/food');

// @route   GET api/food/items
// @desc    Get all food items
// @access  Private
router.get('/items', auth, async (req, res) => {
  try {
    const items = await FoodItem.find({ isAvailable: true }).sort({ category: 1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/food/items/:category
// @desc    Get food items by category
// @access  Private
router.get('/items/:category', auth, async (req, res) => {
  try {
    const items = await FoodItem.find({ 
      category: req.params.category,
      isAvailable: true 
    });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/food/order
// @desc    Place food order
// @access  Private
router.post('/order', auth, async (req, res) => {
  try {
    const { items, total, eventId, deliveryLocation } = req.body;
    
    const newOrder = new FoodOrder({
      user: req.user.id,
      items,
      total,
      eventId,
      deliveryLocation
    });
    
    const order = await newOrder.save();
    
    // Populate order items for response
    const populatedOrder = await FoodOrder.findById(order._id)
      .populate('user', ['name', 'email'])
      .populate('items.item');
    
    res.json(populatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/food/orders
// @desc    Get all orders for current user
// @access  Private
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await FoodOrder.find({ user: req.user.id })
      .sort({ orderDate: -1 })
      .populate('items.item')
      .populate('eventId', ['title', 'date']);
    
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/food/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/orders/:id', auth, async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id)
      .populate('items.item')
      .populate('eventId', ['title', 'date']);
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check if order belongs to current user
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/food/orders/:id
// @desc    Cancel order
// @access  Private
router.delete('/orders/:id', auth, async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check if order belongs to current user
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Check if order can be cancelled
    if (['delivered', 'ready'].includes(order.status)) {
      return res.status(400).json({ msg: 'Cannot cancel order at current status' });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({ msg: 'Order cancelled successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;