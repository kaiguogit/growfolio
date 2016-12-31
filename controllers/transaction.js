/**
 * GET /transactions
 * List all transactions.
 */
const Transaction = require('../models/Transaction.js');


const handleError = (err) => {
  console.log(err);
};

exports.getTransactions = (req, res) => {
  Transaction.find((err, data) =>
    res.json({ result: data })
  );
};

exports.createTransactions = (req, res) => {
  const data = req.body;
  const trsc = new Transaction(data);
  trsc.save((err, data) => {
    res.json({ result: data });
  });
};

exports.deleteTransactions = (req, res) => {
  Transaction.remove({ _id: req.body.id }, (err) => {
    if (err) return handleError(err);
    // removed!
    res.json({ result: { message: 'removed' } });
  });
};
