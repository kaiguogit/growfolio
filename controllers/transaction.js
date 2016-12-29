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
  const trsc = new Transaction({
    name: data.name,
    symbol: data.symbol,
    shares: data.shares,
    price: data.price,
    type: data.type,
    commission: data.commission,
    date: data.date
  });
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
