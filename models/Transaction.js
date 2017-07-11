const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  currency: String,
  exch: String,
  shares: Number,
  price: Number,
  // Is price for total or pershare?
  totalOrPerShare: Boolean,
  type: String,
  commission: Number,
  date: Date,
  notes: String,
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
