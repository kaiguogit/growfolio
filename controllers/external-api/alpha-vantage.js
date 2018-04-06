const rp = require('request-promise-native');
const BASE_URI = 'https://www.alphavantage.co/query';

//TO-DO add timeout in case remote server is slow.
// See https://www.npmjs.com/package/request#timeouts
const defaultRequest = rp.defaults({
    uri: BASE_URI,
    json: true,
    qs: {
        apikey: process.env.ALPHA_VANTAGE_API_KEY
    }
});

const basicErrorChecking = (response) => {
    const message = response.Information || response['Error Message'];
    if (message) {
        return Promise.reject({message});
    }
    return response;
};

exports.exchangeRate = () => {
    const params = {
        qs: {
            function: 'CURRENCY_EXCHANGE_RATE',
            from_currency: 'USD',
            to_currency: 'CAD',
        }
    };
    return defaultRequest(params).then(basicErrorChecking);
};

// Expect symbol for TSX to have prefix "TSX:", e.g TSX:VFV
exports.dailyQuote = (symbol) => {
    const params = {
        qs: {
            function: 'TIME_SERIES_DAILY',
            symbol
        }
    };
    return defaultRequest(params).then(basicErrorChecking);
};

// Expect symbol for TSX to NOT have prefix "TSX:", e.g VFV
// Different to daily quote, I know.
exports.intraDayQuote = (symbol) => {
    const params = {
        qs: {
            function: 'TIME_SERIES_INTRADAY',
            interval: '15min',
            symbol
        }
    };
    return defaultRequest(params).then(basicErrorChecking);
};