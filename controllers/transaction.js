/**
 * GET /transactions
 * List all transactions.
 */
const Transaction = require('../models/Transaction.js');


const handleError = (err) => {
  console.log(err);
};

exports.getTransactions = (req, res) => {
  Transaction.find({ _user: req.user._id })
  .exec((err, data) => {
    if (err) {
      res.json({ result: [], error: err });
    } else {
      res.json({ result: data });
    }
  });
};

exports.createTransactions = (req, res) => {
  const keys = ['name', 'symbol', 'currency', 'exch', 'shares', 'price', 'type', 'commission', 'date', 'notes'];
  const data = {};
  keys.forEach((key) => {
    data[key] = req.body[key];
  });
  data._user = req.user._id;
  const trsc = new Transaction(data);
  trsc.save((err, data) => {
    res.json({ result: data });
  });
};

exports.deleteTransactions = (req, res) => {
  Transaction.remove({ _id: req.body.id, _user: req.user._id }, (err) => {
    if (err) return handleError(err);
    // removed!
    res.json({ result: { message: 'removed' } });
  });
};
