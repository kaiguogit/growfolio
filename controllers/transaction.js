const numeral = require('numeral');
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

const isString = value => (typeof value === 'string');
const num = value => numeral(value).value();
const isValidNum = value => num(value) >= 0;

/**
 * Validate the transaction form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
const validateTransactionForm = (payload) => {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload) {
    return {
      success: false,
      errors: {},
      message: 'Form is empty'
    };
  }

  if (!isString(payload.name) || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide ticker name.';
  }

  if (!isString(payload.symbol) || payload.symbol.trim().length === 0) {
    isFormValid = false;
    errors.symbol = 'Please provide ticker symbol.';
  }

  // if (!num(payload.date)) {
  //   isFormValid = false;
  //   // TODO: rule is not right.
  //   errors.date = 'Date is invalid';
  // }

  if (!isString(payload.currency) || (payload.currency !== 'USD' &&
    payload.currency !== 'CAD')) {
    isFormValid = false;
    errors.currency = 'Currency can only be CAD or USD';
  }

  // if (!isString(payload.notes)) {
  //   isFormValid = false;
  //   errors.notes = 'Notes has to be string';
  // }

  if (!isValidNum(payload.shares)) {
    isFormValid = false;
    errors.shares = 'Shares is invalid';
  }

  if (!isValidNum(payload.price)) {
    isFormValid = false;
    errors.price = 'Price is invalid';
  }

  if (!isValidNum(payload.commission)) {
    isFormValid = false;
    errors.commission = 'Commission is invalid';
  }

  if (!isString(payload.type) || (payload.type !== 'buy' && payload.type !== 'sell' &&
    payload.type !== 'dividend')) {
    isFormValid = false;
    errors.type = 'Type can only be buy or sell or dividend';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
};

exports.createTransactions = (req, res) => {


  const keys = ['name', 'symbol', 'currency', 'exch', 'shares', 'price', 'type', 'commission', 'date', 'notes'];
  const data = {};
  keys.forEach((key) => {
    data[key] = req.body[key];
  });

  const validationResult = validateTransactionForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

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
