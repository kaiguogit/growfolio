const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  symbol: String,
  date: String,
  price: Number,
  change: Number,
  changePercent: Number,
  currency: String,
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Quote = mongoose.model('Quote', quoteSchema);
module.exports = Quote;
