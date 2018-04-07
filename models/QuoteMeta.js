const mongoose = require('mongoose');

// Use to save status of user's last saved quotes.
const quoteMetaSchema = new mongoose.Schema({
  symbol: String,
  lastRefreshedIntraday: String,
  lastRefreshedDaily: String,
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Quote = mongoose.model('QuoteMeta', quoteMetaSchema);
module.exports = Quote;
