const mongoose = require('mongoose');

const HostSchema = new mongoose.Schema({
  hostId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: 'Event Host',
  },
});

module.exports = mongoose.model('Host', HostSchema);
