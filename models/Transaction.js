const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  symbol: String,
  shares: Number,
  price: Number,
  type: String,
  commission: Number,
  date: Date,
  notes: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;