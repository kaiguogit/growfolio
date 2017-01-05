const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  symbol: String,
  percentage: Number,
  label: String
});

const Allocation = mongoose.model('Allocation', allocationSchema);
module.exports = Allocation;
