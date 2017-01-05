'use strict';
/**
 * GET /allocations
 * List all transactions.
 */
const Allocation = require('../models/Allocation.js');


const handleError = (err) => {
  console.log(err);
};

exports.getAllocations = (req, res) => {
  Allocation.find((err, data) =>
    res.json({ result: data })
  );
};

exports.createAllocations = (req, res) => {
  const data = req.body;
  const result = [];
  data.forEach((entry) => {
    // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    const query = Allocation.findOneAndUpdate(
      { symbol: entry.symbol },
      entry,
      { new: true, upsert: true });

    query.exec((err, doc) => {
      if (err) throw err;
      result.push(doc);
    });
  });
  res.json({ result });
};

exports.deleteAllocations = (req, res) => {
  Allocation.remove({ _id: req.body.id }, (err) => {
    if (err) return handleError(err);
    // removed!
    res.json({ result: { message: 'removed' } });
  });
};
