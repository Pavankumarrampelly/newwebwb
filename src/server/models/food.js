const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['snacks', 'meals', 'beverages', 'desserts'],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  }
});

const FoodOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryLocation: {
    type: String,
    required: true
  }
});

exports.FoodItem = mongoose.model('FoodItem', FoodItemSchema);
exports.FoodOrder = mongoose.model('FoodOrder', FoodOrderSchema);