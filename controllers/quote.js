const { errorResponse } = require('../utils');
const numeral = require('numeral');
const fakeDailyQuote = require('./fixtures/dailyQuote.json');
const fakeIntradayQuote = require('./fixtures/intradayQuote.json');
const merge = require('lodash/merge');
const {dailyQuote: callDailyQuoteApi, intraDayQuote: callIntraDayQuoteApi} = require('./external-api/alpha-vantage');

/**
 * GET /historical-quotes
 */
const Quote = require('../models/Quote.js');
const QuoteMeta = require('../models/QuoteMeta.js');
const TYPES = {
    INTRADAY: 'INTRADAY',
    DAILY: 'DAILY'
};

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

const removePrefix = (symbol) => {
    if (symbol && symbol.startsWith('TSX:')) {
        return symbol.replace('TSX:', '');
    }
    return symbol;
};

const saveQuotes = (userId, isIntraday) => (response) => {
    const meta = response['Meta Data'];
    isIntraday = !!isIntraday;
    const dataKey = Object.keys(response).find(key => key.includes('Time Series'));
    const quotes = response[dataKey];
    let resultMeta;
    let resultData = {};
    if (meta && quotes) {
        let symbol = removePrefix(meta['2. Symbol']);
        let lastRefreshed = meta['3. Last Refreshed'];
        const promises = Object.keys(quotes).map((date) => {
            return Quote.findOne({ date, symbol, _user: userId }).exec().then(foundQuote => {
                if (foundQuote) {
                    resultData[date] = foundQuote;
                } else {
                    const data = Object.assign({
                        _user: userId,
                        isIntraday,
                        symbol,
                        date
                    }, normalizeAPIResult(quotes[date]));
                    return new Quote(data).save().then((savedQuote) => {
                        resultData[date] = savedQuote;
                    });
                }
            }, error => {
                // TO-DO should I send db error back?
                console.log(error);
            });

        });
        const metaPromise = QuoteMeta.findOne({symbol, _user: userId}).exec()
        .then(foundMeta => {
            let quoteMeta;
            let refereshTimeKey = isIntraday ? 'lastRefreshedIntraday' : 'lastRefreshedDaily';
            if (foundMeta) {
                quoteMeta = foundMeta;
                quoteMeta[refereshTimeKey] = lastRefreshed;
            } else {
                quoteMeta = new QuoteMeta({
                    _user: userId,
                    isIntraday,
                    symbol,
                    [refereshTimeKey]: lastRefreshed
                });
            }
            return quoteMeta.save().then(savedMeta => resultMeta = savedMeta);
        });
        promises.push(metaPromise);
        return Promise.all(promises).then(
            () => {
                return {
                    meta: resultMeta,
                    data: resultData
                };
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }
    return Promise.reject({message: 'api response is not valid'});
};

/**
 * Get quotes for single symbol
 * @param {string} symbol
 * @param {string} type 'intraday' or 'daily'
 * @param {object} userId
 */
const getSingleQuote = (symbol, type, userId) => {
    const isIntraday = type === TYPES.INTRADAY;
    const fakeData = isIntraday ? fakeIntradayQuote : fakeDailyQuote;
    const callApiFn = isIntraday ? callIntraDayQuoteApi : callDailyQuoteApi;
    // return Promise.resolve(fakeData)
    return callApiFn(symbol)
    .then(saveQuotes(userId, isIntraday));
};

/**
 * Get quotes for multiple symbols
 * @param {array} symbols
 * @param {string} type 'INTRADAY' or 'DAILY'
 * @param {object} userId
 */
const getMultipleQuotes = (symbols, type, userId) => {
    return result => {
        if (!result) {
            result = {
                meta: {},
                data: {}
            };
        }
        return symbols.reduce((p, symbol) => {
            return p.then(getSingleQuote.bind(null, symbol, type, userId))
            .then(quote => {
                if (quote) {
                    const data = result.data;
                    const meta = result.meta;
                    symbol = removePrefix(symbol);
                    data[symbol] = merge({}, data[symbol], quote.data);
                    meta[symbol] = merge({}, meta[symbol], quote.meta);
                }
                return result;
            });
        }, Promise.resolve());
    };
};

const getMultipleQuotesAllTypes = (symbols, userId) => {
    return Object.keys(TYPES).reduce((promise, type) =>{
        return promise.then(getMultipleQuotes(symbols, type, userId));
    }, Promise.resolve({
        meta: {},
        data: {}
    }));
};

/**
 * POST /api/quotes
 */
exports.getQuoteHandler = (req, res) => {
    const symbols = req.query.symbols && req.query.symbols.split(',');
    if (!(symbols && symbols.length)) {
        return res.json(errorResponse('parameter symbols must be comma separated'));
    }
    const userId = req.user._id;
    getMultipleQuotesAllTypes(symbols, userId)
    .then((result) => {
        res.json({success: true, result});
    }).catch(error => {
        res.json(errorResponse(error.message, null, {error}));
    });
};
