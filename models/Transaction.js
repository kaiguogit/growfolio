const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  currency: String,
  exch: String,
  shares: Number,
  amount: Number,
  // Is amount for total or pershare?
  totalOrPerShare: Boolean,
  // Dividend's return of capital
  returnOfCapital: Number,
  // Dividend's capital gain
  capitalGain: Number,
  type: String,
  account: String,
  commission: Number,
  date: Date,
  notes: String,
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
