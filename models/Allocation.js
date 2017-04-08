const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  symbol: String,
  percentage: Number,
  label: String,
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Allocation = mongoose.model('Allocation', allocationSchema);
module.exports = Allocation;
