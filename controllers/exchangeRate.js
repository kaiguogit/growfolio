// const fakeData = require('./fakeData/exchangeRate.json');
const {exchangeRate: callApi} = require('./external-api/alpha-vantage');
const {errorResponse} = require('../utils');

const normalizeAPIResult = (response) => {
    const result = {};
    ["1. From_Currency Code",
    "2. From_Currency Name",
    "3. To_Currency Code",
    "4. To_Currency Name",
    "5. Exchange Rate",
    "6. Last Refreshed",
    "7. Time Zone"
    ].forEach((key) => {
        const normalKey = key.split('. ')[1];
        result[normalKey] = response[key];
    });
    return result;
};

// https://www.npmjs.com/package/request#requestoptions-callback

/**
 * POST /api/download-historical-quotes
 */
exports.getRealTimeExchangeRate = (req, res) => {
    // TODO
    // pass date and check if quote exists already before calling api to avoid too many api calls.
    // Promise.resolve(fakeData)
    callApi()
    .then((result) => {
        const key = 'Realtime Currency Exchange Rate';
        if (result[key]) {
            return res.json({success: true, result: normalizeAPIResult(result[key])});
        }
        return Promise.reject({message: 'api response is not valid'});
    }).catch((error) => {
        res.json(errorResponse(null, error.message, {error}));
    });
};

