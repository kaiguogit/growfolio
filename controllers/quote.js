const { errorResponse } = require('../utils');
const numeral = require('numeral');
// const fakeData = require('./fakeData/quote.json');
const {dailyQuote: callApi} = require('./external-api/alpha-vantage');

/**
 * GET /historical-quotes
 */
const Quote = require('../models/Quote.js');


const handleError = (err) => {
    console.log(err);
};

exports.getHistoricalQuotes = (req, res) => {
    Quote.find({
        _user: req.user._id,
    }).exec((err, data) => {
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
 * Validate the quote form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
const validateQuoteForm = (payload) => {
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

    if (!isString(payload.symbol) || payload.symbol.trim().length === 0) {
        isFormValid = false;
        errors.symbol = 'Please provide ticker symbol.';
    }

    if (!isString(payload.date) || payload.date.trim().length === 0) {
        isFormValid = false;
        // TODO more robust date validation.
        // Currently only expect DD-MM-YYYY
        errors.symbol = 'Please provide date.';
    }

    if (!isString(payload.currency) || (payload.currency !== 'USD' &&
        payload.currency !== 'CAD')) {
        isFormValid = false;
        errors.currency = 'Currency can only be CAD or USD';
    }

    if (!isValidNum(payload.price)) {
        isFormValid = false;
        errors.amount = 'Price is invalid';
    }

    if (!isValidNum(payload.change)) {
        isFormValid = false;
        errors.amount = 'Change is invalid';
    }

    if (!isValidNum(payload.changePercent)) {
        isFormValid = false;
        errors.amount = 'Change percent is invalid';
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

const createOrEditQuotes = isEdit => (req, res) => {
    const keys = ['symbol', 'currency', 'price', 'date', 'change', 'changePercent'];
    const data = {};
    keys.forEach((key) => {
        data[key] = req.body[key];
    });

    const validationResult = validateQuoteForm(data);
    if (!validationResult.success) {
        return res.status(400).json(returnError(validationResult.message, validationResult.errors));
    }

    data._user = req.user._id;

    if (!isEdit) {
        new Quote(data).save((err, savedTsc) => {
            return res.json({ result: savedTsc });
        });
    } else {
        Quote.findById(req.body._id, (error, tsc) => {
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

exports.createHistoricalQuotes = createOrEditQuotes(false);
exports.editHistoricalQuotes = createOrEditQuotes(true);

exports.deleteHistoricalQuotes = (req, res) => {
    Quote.remove({ _id: req.body.id, _user: req.user._id }, (err) => {
        if (err) return handleError(err);
        // removed!
        res.json({ result: { message: 'removed' } });
    });
};

const normalizeAPIResult = (response) => {
    const result = {};
    ['1. open', '2. high', '3. low', '4. close', '5. volume'].forEach((key) => {
        const normalKey = key.split('. ')[1];
        result[normalKey] = response[key];
    });
    return result;
};

const saveQuotes = (userId) => (response) => {
    const meta = response['Meta Data'];
    const quotes = response['Time Series (Daily)'];
    if (meta && quotes) {
        let symbol = meta['2. Symbol'];
        if (symbol && symbol.startsWith('TSX:')) {
            symbol = symbol.replace('TSX:', '');
        }
        const result = [];
        // let lastRefreshed = meta['3. Last Refreshed'];
        // result.quote = quotes[lastRefreshed] && quotes[lastRefreshed]['4. close'] || {};
        const promises = Object.keys(quotes).map((date) => {
            return Quote.findOne({ date, symbol, userId }).exec().then((foundQuote) => {
                if (foundQuote) {
                    result.push(foundQuote);
                } else {
                    const data = Object.assign({
                        _user: userId,
                        symbol,
                        date
                    }, normalizeAPIResult(quotes[date]));
                    return new Quote(data).save().then((savedQuote) => {
                        result.push(savedQuote);
                    });
                }
            }, error => {
                // TO-DO should I send db error back?
                console.log(error);
            });

        });
        return Promise.all(promises).then(
            () => {
                return result;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }
    return Promise.reject({message: 'api response is not valid'});
};

/**
 * POST /api/download-historical-quotes
 */
exports.downloadHistoricalQuotes = (req, res) => {
    const symbol = req.body.symbol;
    const userId = req.user._id;
    // TODO
    // pass date and check if quote exists already before calling api to avoid too many api calls.
    // Promise.resolve(fakeData)
    callApi(symbol)
    .then(saveQuotes(userId))
    .then((result) => {
        res.json({success: true, result});
    }).catch(error => {
        res.json(errorResponse(null, error.message, {error}));
    });
};
