const { errorResponse } = require('../utils');
const numeral = require('numeral');
const fakeDailyQuote = require('./fixtures/dailyQuote.json');
const fakeIntradayQuote = require('./fixtures/intradayQuote.json');
const merge = require('lodash/merge');
const moment = require('moment-timezone');
const {dailyQuote: callDailyQuoteApi, intraDayQuote: callIntraDayQuoteApi} = require('./external-api/alpha-vantage');

const NEW_YORK_TIME_ZONE = 'America/New_York';
/**
 * GET /historical-quotes
 */
const Quote = require('../models/Quote.js');
const QuoteMeta = require('../models/QuoteMeta.js');

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

const getQuoteFromDb = (symbol, isIntraday, _user, asFallback) => {
    let resultMeta;
    let resultData = {};
    symbol = removePrefix(symbol);
    const quotePromise = Quote.find({symbol, _user}).exec().then(quotes => {
        if (quotes && Array.isArray(quotes)) {
            quotes.forEach(quote => {
                resultData[quote.date] = quote;
            });
        }
    });
    const metaPromise = QuoteMeta.findOne({symbol, _user}).exec().then(meta => {
        resultMeta = meta;
    });
    return Promise.all([quotePromise, metaPromise]).then(
        () => {
            return {
                meta: resultMeta,
                data: resultData,
                // TODO can be deleted, added here to see if logic works well.
                from: asFallback ? 'db as fallback' : 'db'
            };
        },
        error => {
            return Promise.reject(error);
        }
    );
};

const saveQuotesFromAPI = (isIntraday, _user) => (response) => {
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
            return Quote.findOne({ date, symbol, _user }).exec().then(foundQuote => {
                if (foundQuote) {
                    resultData[date] = foundQuote;
                } else {
                    const data = Object.assign({
                        _user,
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
        const metaPromise = QuoteMeta.findOne({symbol, _user}).exec()
        .then(foundMeta => {
            let quoteMeta;
            let refereshTimeKey = isIntraday ? 'lastRefreshedIntraday' : 'lastRefreshedDaily';
            if (foundMeta) {
                quoteMeta = foundMeta;
                quoteMeta[refereshTimeKey] = lastRefreshed;
            } else {
                quoteMeta = new QuoteMeta({
                    _user,
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
                    data: resultData,
                    // TODO can be deleted, added here to see if logic works well.
                    from: 'api'
                };
            },
            error => {
                return Promise.reject(error);
            }
        );
    }
    return Promise.reject({message: 'api response is not valid'});
};

process.moment = moment;

const guardEmptyDate = (date) => {
    if (!date) {
        return moment();
    }
    if (!moment.isMoment(date)) {
        return moment(date);
    }
    return date;
};

/**
 * is date one of week day?
 * @param {Moment} date
 */
const isWeekDay = date => {
    date = guardEmptyDate(date);
    const dow = date.tz(NEW_YORK_TIME_ZONE).day();
    if (dow > 0 && dow < 6) {
        return true;
    }
    return false;
};

/**
 * Get last week day.
 * @param {Moment} date On or before the date.
 */
const lastWeekDay = (date) => {
    date = guardEmptyDate(date);
    let dow = date.tz(NEW_YORK_TIME_ZONE).day();
    if (dow === 0) {
        //today is Sunday return last Friday
        return moment.tz(NEW_YORK_TIME_ZONE).day(-2);
    }
    if (dow === 6) {
        //today is Staturday return this Friday
        return moment.tz(NEW_YORK_TIME_ZONE).day(5);
    }
    // today is weekday
    return date;
};

const isMarketOpened = () => {
    if (isWeekDay()) {
        const now = moment();
        // Set to new york time's 9:30 - 16:00
        const marketOpen = moment.tz(NEW_YORK_TIME_ZONE).hour(9).minute(30).second(0);
        const marketClose = moment.tz(NEW_YORK_TIME_ZONE).hour(16).minute(0).second(0);
        //Exclusive https://momentjs.com/docs/#/query/is-between/
        return now.isBetween(marketOpen, marketClose, 'minute', '()');
    }
    return false;
};

const yesterday = () => {
    return moment().subtract(1, 'days');
};

/**
 * Should call api if:
 * Daily
 * 1. market is open, last refresh is earlier than last week day.
 * 2. market is closed, last refresh is earlier than today.
 * Intraday
 * 1. market is open and last refresh is more than 15 minutes ago.
 * @param {string} symbol No prefix.
 * @param {boolean} isIntraday intraday or daily
 * @param {object} _user user id.
 * @return {promise}
 */
const shouldCallApi = (symbol, isIntraday, _user) => {
    symbol = removePrefix(symbol);
    return QuoteMeta.findOne({symbol, _user}).exec().then(foundMeta => {
        if (!foundMeta) {
            return true;
        }
        const lastRefreshedIntraday = foundMeta.lastRefreshedIntraday;
        const lastRefreshedDaily = foundMeta.lastRefreshedDaily;
        const marketOpened = isMarketOpened();
        if (isIntraday) {
            if (!lastRefreshedIntraday) {
                return true;
            }
            if (marketOpened) {
                if (moment.tz(lastRefreshedIntraday, NEW_YORK_TIME_ZONE).isBefore(moment().subtract(5, 'minutes'))) {
                    return true;
                }
            }
        } else {
            if (!lastRefreshedDaily) {
                return true;
            }
            const expectedDate = marketOpened ? lastWeekDay(yesterday()) : lastWeekDay();
            if (moment.tz(lastRefreshedDaily, NEW_YORK_TIME_ZONE).isBefore(expectedDate, 'day')) {
                return true;
            }
        }
        return false;
    });
};

/**
 * Get quotes for single symbol
 * @param {string} symbol expected TSX as prefix
 * @param {boolean} isIntraday 'intraday' or 'daily'
 * @param {object} userId
 */
const getSingleQuote = (symbol, isIntraday, userId) => {
    const fakeData = isIntraday ? fakeIntradayQuote : fakeDailyQuote;
    const callApi = isIntraday ? callIntraDayQuoteApi : callDailyQuoteApi;
    // return Promise.resolve(fakeData)
    return shouldCallApi(symbol, isIntraday, userId).then(necessary => {
        if (necessary) {
            return callApi(symbol).then(saveQuotesFromAPI(isIntraday, userId)).catch(() => {
                return getQuoteFromDb(symbol, isIntraday, userId, true);
            });
        }
        return getQuoteFromDb(symbol, isIntraday, userId);
    });
};

/**
 * Get quotes for multiple symbols
 * @param {array} symbols
 * @param {boolean} isIntraday 'intraday' or 'daily'
 * @param {object} userId
 */
const getMultipleQuotes = (symbols, isIntraday, userId) => {
    return result => {
        if (!result) {
            result = {
                meta: {},
                data: {},
                // TODO can be deleted, added here to see if logic works well.
                dailyFrom: {},
                intradayFrom: {}
            };
        }
        return symbols.reduce((p, symbol) => {
            return p.then(getSingleQuote.bind(null, symbol, isIntraday, userId))
            .then(quote => {
                if (quote) {
                    symbol = removePrefix(symbol);
                    ['meta', 'data'].forEach(key => {
                        result[key][symbol] = merge({}, result[key][symbol], quote[key]);
                    });
                    const fromKey = isIntraday ? 'intradayFrom' : 'dailyFrom';
                    result[fromKey][symbol] = quote.from;
                }
                return result;
            });
        }, Promise.resolve());
    };
};

const getMultipleQuotesAllTypes = (symbols, userId) => {
    return [true, false].reduce((promise, isIntraday) => {
        return promise.then(getMultipleQuotes(symbols, isIntraday, userId));
    }, Promise.resolve({
        meta: {},
        data: {},
        // TODO can be deleted, added here to see if logic works well.
        dailyFrom: {},
        intradayFrom: {}
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
