const fakeData = require('./fixtures/exchangeRate.json');
const {exchangeRate: callApi} = require('./external-api/alpha-vantage');
const {errorResponse} = require('../utils');
const moment = require('moment-timezone');
const {NEW_YORK_TIME_ZONE} = require('../utils/time');
const ExchangeRate = require('../models/ExchangeRate.js');

const normalizeAPIResult = (response, _user) => {
    const result = {};
    const keyMap = {
        '1. From_Currency Code': 'fromCurrency',
        '3. To_Currency Code': 'toCurrency',
        '5. Exchange Rate': 'rate',
        '6. Last Refreshed': 'date'
    };
    Object.keys(keyMap).forEach(key => {
        const normalKey = keyMap[key];
        result[normalKey] = response[key];
    });
    result.date = moment.utc(result.date).tz(NEW_YORK_TIME_ZONE).format('YYYY-MM-DD');
    result.isRealTime = true;
    result._user = _user;
    return result;
};

const getRateFromDb = _user => {
    return ExchangeRate.findOne({
        fromCurrency: 'USD',
        toCurrency: 'CAD',
        date: moment.tz(NEW_YORK_TIME_ZONE).format('YYYY-MM-DD'),
        _user
    }).exec().then(foundRate => {
        return foundRate;
    });
};

const saveExchangeRateFromAPI = _user => response => {
    const key = 'Realtime Currency Exchange Rate';
    if (response[key]) {
        const result = normalizeAPIResult(response[key], _user);
        return ExchangeRate.findOne({
            fromCurrency: 'USD',
            toCurrency: 'CAD',
            date: result.date,
            _user
        }).exec().then(foundRate => {
            if (foundRate) {
                return foundRate;
            }
            return new ExchangeRate(result).save().then(savedRate => {
                return savedRate;
            });
        });
    }
    return Promise.reject({message: 'api response is not valid'});
};

/**
 * POST /api/exchange-rate
 */
exports.getRealTimeExchangeRate = (req, res) => {
    const userId = req.user._id;
    return getRateFromDb(userId).then(foundRate => {
        if (foundRate) {
            return foundRate;
        }
        // return Promise.resolve(fakeData)
        return callApi()
        .then(saveExchangeRateFromAPI(userId));
    })
    .then(result => {
        res.json({success: true, result});
    }).catch((error) => {
        res.json(errorResponse(error.message, null, {error}));
    });
};

