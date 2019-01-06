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

  if (!isString(payload.account) ||
    (payload.account !== 'kai-tfsa' &&
      payload.account !== 'kai-rrsp' &&
      payload.account !== 'kai-spouse-rrsp' &&
      payload.account !== 'kai-non-registered' &&
      payload.account !== 'crystal-tfsa' &&
      payload.account !== 'crystal-rrsp' &&
      payload.account !== 'crystal-non-registered')) {
    isFormValid = false;
    errors.account = 'Account name is not valid.';
  }

  // if (!isString(payload.notes)) {
  //   isFormValid = false;
  //   errors.notes = 'Notes has to be string';
  // }

  if (!isValidNum(payload.shares)) {
    isFormValid = false;
    errors.shares = 'Shares is invalid';
  }

  if (!isValidNum(payload.returnOfCapital)) {
    isFormValid = false;
    errors.returnOfCapital = 'Return of capital is invalid';
  }

  if (!isValidNum(payload.capitalGain)) {
    isFormValid = false;
    errors.capitalGain = 'Capital gain is invalid';
  }

  if (!isValidNum(payload.amount)) {
    isFormValid = false;
    errors.amount = 'Amount is invalid';
  }

  if (typeof payload.totalOrPerShare !== 'boolean') {
    isFormValid = false;
    errors.totalOrPerShare = 'TotalOrPerShare can only be true or false';
  }

  if (!isValidNum(payload.commission)) {
    isFormValid = false;
    errors.commission = 'Commission is invalid';
  }

  if (!isString(payload.type) || ['buy', 'sell', 'dividend', 'deposit'].every(type => payload.type !== type)) {
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

const returnError = (message, errors) => ({
  success: false,
  message,
  errors
});

const createOrEditTransactions = isEdit => (req, res) => {
  const keys = ['name', 'symbol', 'currency', 'exch', 'shares', 'totalOrPerShare', 'amount', 'type',
    'account', 'commission', 'date', 'notes', 'returnOfCapital', 'capitalGain'];
  const data = {};
  keys.forEach((key) => {
    data[key] = req.body[key];
  });
  data.totalOrPerShare = !!req.body.totalOrPerShare;

  const validationResult = validateTransactionForm(data);
  if (!validationResult.success) {
    return res.status(400).json(returnError(validationResult.message, validationResult.errors));
  }

  data._user = req.user._id;

  if (!isEdit) {
    new Transaction(data).save((err, savedTsc) => {
      return res.json({ result: savedTsc });
    });
  } else {
    Transaction.findById(req.body._id, (error, tsc) => {
      if (error) {
        return res.status(400).json(returnError(`Cannot find transaction ${req.body._id}`, error));
      }

      Object.assign(tsc, data);
      tsc.save((error, updatedTsc) => {
        if (error) {
          return res.status(400).json(returnError(`Cannot update transaction ${req.body._id}`, error));
        }
        return res.json({ result: updatedTsc });
      });
    });
  }
};

exports.createTransactions = createOrEditTransactions(false);
exports.editTransactions = createOrEditTransactions(true);

exports.deleteTransactions = (req, res) => {
  Transaction.remove({ _id: req.body.id, _user: req.user._id }, (err) => {
    if (err) return handleError(err);
    // removed!
    res.json({ result: { message: 'removed' } });
  });
};
