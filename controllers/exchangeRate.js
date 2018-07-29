const fakeData = require('./fixtures/exchangeRate.json');
const {exchangeRate: callRealTimeApi} = require('./external-api/alpha-vantage');
const {exchangeRate: callHistoricalApi} = require('./external-api/bank-of-canada');
const {errorResponse} = require('../utils');
const moment = require('moment-timezone');
const {NEW_YORK_TIME_ZONE} = require('../utils/time');
const ExchangeRate = require('../models/ExchangeRate.js');
const legacyRates = require('./fixtures/dailyExchangeRates.json');

const processRealTimeAPIResult = _user => response => {
    const respData = response['Realtime Currency Exchange Rate'];
    if (!respData) {
        return Promise.reject({message: 'api response is not valid'});
    }
    const result = {};
    const keyMap = {
        '1. From_Currency Code': 'fromCurrency',
        '3. To_Currency Code': 'toCurrency',
        '5. Exchange Rate': 'rate',
        '6. Last Refreshed': 'date'
    };
    Object.keys(keyMap).forEach(key => {
        const normalKey = keyMap[key];
        result[normalKey] = respData[key];
    });
    result.date = moment.utc(result.date).tz(NEW_YORK_TIME_ZONE).format('YYYY-MM-DD');
    result.isRealTime = true;
    result._user = _user;
    return Promise.resolve(result);
};

const getOneRateFromDb = (_user, date) => {
    return ExchangeRate.findOne({
        fromCurrency: 'USD',
        toCurrency: 'CAD',
        date,
        _user
    }).exec();
};

const getAllRateFromDb = (_user, params) => {
    return ExchangeRate.find(Object.assign({
        fromCurrency: 'USD',
        toCurrency: 'CAD',
        _user
    }, params)).exec().then(rates => {
        if (rates && Array.isArray(rates)) {
            return rates.reduce((result, rate) => {
                result[rate.date] = rate.rate;
                return result;
            }, {});
        }
    });
};

const saveExchangeRate = _user => rate => {
    return ExchangeRate.findOne({
        fromCurrency: 'USD',
        toCurrency: 'CAD',
        date: rate.date,
        isRealTime: !!rate.isRealTime,
        _user
    }).exec().then(foundRate => {
        if (foundRate) {
            return foundRate;
        }
        return new ExchangeRate(rate).save().then(savedRate => {
            return savedRate;
        });
    });
};

/**
 * POST /api/exchange-rate
 */
exports.getRealTimeExchangeRate = (req, res) => {
    const userId = req.user._id;
    const date = moment.tz(NEW_YORK_TIME_ZONE).format('YYYY-MM-DD');
    return getOneRateFromDb(userId, date).then(foundRate => {
        if (foundRate) {
            return foundRate;
        }
        // return Promise.resolve(fakeData)
        return callRealTimeApi().then(processRealTimeAPIResult(userId))
        .then(saveExchangeRate(userId));
    }).then(result => {
        res.json({success: true, result});
    }).catch((error) => {
        res.json(errorResponse(error.message, null, {error}));
    });
};

const loadLegacyRates = _user => {
    //Load legacy exchange rates
    return Promise.all(Object.keys(legacyRates.observations).map(date => {
        const rate = legacyRates.observations[date];
        const exchangeRate = {
            fromCurrency: 'USD',
            toCurrency: 'CAD',
            date,
            rate,
            _user,
            isRealTime: false
        };
        return saveExchangeRate(_user)(exchangeRate);
    }));
};
/**
 * POST /api/download-exchange-rate
 */
exports.downloadExchangeRate = (req, res) => {
    const _user = req.user._id;
    const reqDate = req.body.start_date;
    return loadLegacyRates(_user)
    .then(() => {
        return callHistoricalApi(reqDate);
    }).then(data => {
        const promises = (data || []).map(map => {
            const date = map.d;
            const rate = map.FXUSDCAD && map.FXUSDCAD.v;
            if (date && rate) {
                const exchangeRate = {
                    fromCurrency: 'USD',
                    toCurrency: 'CAD',
                    date,
                    rate,
                    _user,
                    isRealTime: false
                };
                return saveExchangeRate(_user)(exchangeRate);
            }
            return Promise.resolve();
        });
        return Promise.all(promises);
    }).then(() => {
        return getAllRateFromDb(_user, {isRealTime: false});
    }).then(result => {
        res.json({success: true, result});
    }).catch((error) => {
        res.json(errorResponse(error.message, null, {error}));
    });
};

exports.getExchangeRates = (req, res) => {
    const _user = req.user._id;
    return getAllRateFromDb(_user, {isRealTime: false})
    .then(result => {
        res.json({success: true, result});
    }).catch((error) => {
        res.json(errorResponse(error.message, null, {error}));
    });
};
