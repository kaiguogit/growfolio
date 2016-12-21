/**
 * GET /transactions
 * List all transactions.
 */
const Transaction = require('../models/Transaction.js');

exports.getTransactions = (req, res) => {
  Transaction.find((err, data) => {
    res.send({transactions: data});
  });
};

exports.createTransactions = (req, res) => {
    var data = req.body;
    var trsc = new Transaction({
        symbol: data.symbol,
        shares: data.shares,
        price: data.price,
        type: data.type
    });
    trsc.save((err, data) => {
    res.send({response: data});
    });
};