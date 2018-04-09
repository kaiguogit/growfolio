const mongoose = require('mongoose');

const exchangeRateSchema = new mongoose.Schema({
  fromCurrency: String,
  toCurrency: String,
  date: String,
  rate: Number,
  isRealTime: Boolean,
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const ExchangeRate = mongoose.model('ExchangeRate', exchangeRateSchema);
module.exports = ExchangeRate;
