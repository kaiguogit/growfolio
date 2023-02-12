const mongoose = require('mongoose');

const questradeApiSchema = new mongoose.Schema({
  accessToken: String,
  refreshToken: String,
  apiServer: String,
  tokenType: String,
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Quote = mongoose.model('QuestradeApi', questradeApiSchema);
module.exports = Quote;
