const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  symbol: String,
  date: String,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number,
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Quote = mongoose.model('Quote', quoteSchema);
module.exports = Quote;
