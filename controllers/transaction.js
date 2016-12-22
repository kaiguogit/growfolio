/**
 * GET /transactions
 * List all transactions.
 */
const Transaction = require('../models/Transaction.js');

exports.getTransactions = (req, res) => {
  Transaction.find((err, data) => {
    res.json({result: data});
  });
};

exports.createTransactions = (req, res) => {
    var data = req.body;
    var trsc = new Transaction({
        symbol: data.symbol,
        shares: data.shares,
        price: data.price,
        type: data.type,
        commission: data.commission,
        date: data.date
    });
    trsc.save((err, data) => {
        res.json({result: data});
    });
};

exports.deleteTransactions = (req, res) => {
    Transaction.remove({ _id: req.body.id }, function (err) {
      if (err) return handleError(err);
      // removed!
      res.json({result: {message: "removed"}});
    });
}