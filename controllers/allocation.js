/**
 * GET /allocations
 * List all transactions.
 */
const Allocation = require('../models/Allocation.js');


const handleError = (err) => {
  console.log(err);
};

exports.getAllocations = (req, res) => {
  Allocation.find({ _user: req.user._id })
  .exec((err, data) => {
    if (err) {
      res.json({ result: [], error: err });
    } else {
      res.json({ result: data });
    }
  });
};

exports.createAllocations = (req, res) => {
  const data = req.body;
  const result = [];
  const errors = [];
  data.forEach((entry) => {
    entry._user = req.user._id;
    // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    const query = Allocation.findOneAndUpdate(
      { symbol: entry.symbol },
      entry,
      { new: true, upsert: true });

    query.exec((err, doc) => {
      errors.push(err);
      result.push(doc);
    });
  });
  res.json({ result, error: errors });
};

exports.deleteAllocations = (req, res) => {
  Allocation.remove({ _id: req.body.id, _user: req.user._id }, (err) => {
    if (err) return handleError(err);
    // removed!
    res.json({ result: { message: 'removed' } });
  });
};
