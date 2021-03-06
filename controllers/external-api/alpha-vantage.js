const rp = require('request-promise-native');
const BASE_URI = 'https://www.alphavantage.co/query';

// Global variable to keep track API calls, make them synchronous to avoid calling it too frequently.
let ongoingPromise;
let lastCallTime;

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
    if (!response) {
        return Promise.reject({message: 'Empty response'});
    }
    const message = response && (response.Information || response['Error Message']);
    if (message) {
        return Promise.reject(new Error(message));
    }
    return response;
};

// Always delay sending api by 1 sec if there is an ongoing promise
const delayedRequest = (params) => {
    let delayPromise = Promise.resolve();
    // Break the chain by joining promise
    // https://stackoverflow.com/questions/28250680/how-do-i-access-previous-promise-results-in-a-then-chain/28250704
    const time = new Date();
    if (ongoingPromise) {
        delayPromise = ongoingPromise.delay(15000).catch(() => {});
    } else if (lastCallTime && time - lastCallTime < 15000) {
        // According to https://www.alphavantage.co/premium/
        // Limit is 5 requests per minutes.
        const delay = 15000 - (time - lastCallTime);
        delayPromise = delayPromise.delay(delay);
    }
    let result = ongoingPromise = delayPromise.then(() => {
        lastCallTime = new Date();
        return defaultRequest(params).then(basicErrorChecking);
    });
    const clearOngoing = () => {
        // Clear ongoing if it's not updated by elsewhere.
        if (result === ongoingPromise) {
            ongoingPromise = null;
        }
    };
    result.then(clearOngoing, clearOngoing);
    return result;
};

exports.exchangeRate = () => {
    const params = {
        qs: {
            function: 'CURRENCY_EXCHANGE_RATE',
            from_currency: 'USD',
            to_currency: 'CAD',
        }
    };
    return delayedRequest(params);
};

// Expect symbol for TSX to have prefix "TSX:", e.g TSX:VFV
exports.dailyQuote = (symbol) => {
    const params = {
        qs: {
            function: 'TIME_SERIES_DAILY',
            symbol
        }
    };
    return delayedRequest(params);
};

// Expect symbol for TSX to NOT have prefix "TSX:", e.g VFV
// Different to daily quote, werid, I know.
exports.intraDayQuote = (symbol) => {
    if (symbol && symbol.startsWith('TSX:')) {
        symbol = symbol.replace('TSX:', '');
    }
    const params = {
        qs: {
            function: 'TIME_SERIES_INTRADAY',
            interval: '5min',
            symbol
        }
    };
    return delayedRequest(params);
};