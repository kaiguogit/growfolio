import * as types from '../constants/actionTypes';
import $ from 'jquery';
import Auth from '../services/Auth';

import * as currencyActions from './currency';
import { batchActions } from './';
import { getHoldings } from '../selectors';

import { errorHandler } from '../utils';

const REFRESH_QUOTES_INTERVAL = 600000;
const REFRESH_QUOTES_TIMEOUT = 30000;

export const requestQuotes = () => ({
    type: types.REQUEST_QUOTES
});

export const requestQuotesTimeout = () => ({
    type: types.REQUEST_QUOTES_TIMEOUT
});

export const receiveQuotes = (quotes) => ({
    type: types.RECEIVE_QUOTES,
    receivedAt: Date.now(),
    quotes
});

/**
 * YAHOO Finance API version
 * makeQuotesUrl, processQuotes, fetchQuotes functions
 */
// const makeQuotesUrl = symbols => {
//     // concat symbols into \"YAHOO\",\"GOOGL\",\"AMZN\"
//     let symbolsStr = symbols.map((symbol) => '\"' + symbol + '\"').join(',');
//     let url = 'https://query.yahooapis.com/v1/public/yql';
//     let params = {
//       q: `select * from yahoo.finance.quotes where symbol in (${symbolsStr})`,
//       format:'json',
//       diagnostics: 'true',
//       env: 'store://datatables.org/alltableswithkeys',
//       callback: ''
//     };
//     return makeUrl(url, params);
// };

// const processQuotes = data => {
//     let quotes = data.query.results.quote;
//     // always return an Array.
//     quotes = Array.isArray(quotes) ? quotes : [quotes];
//     // convert to object map
//     let result = {};
//     quotes.forEach(quote => {
//         const { symbol, LastTradePriceOnly: currentPrice, Change: change} = quote;
//         result[quote.symbol] = {symbol, currentPrice, change};
//     });
//     return result;
// };

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
// export const fetchQuotes = symbols => dispatch => {
//     if (!(symbols && Array.isArray(symbols) && symbols.length)) {
//         // console.log("empty symbols, skip fetching");
//         // empty symbols, skip fetching
//         return;
//     }
//     dispatch(requestQuotes());
//     return fetch(makeQuotesUrl(symbols))
//         .then(response => response.json())
//         .then(data => {
//             console.log("response is", data);
//             let result = processQuotes(data);
//             console.log("quotes result is", result);
//             dispatch(receiveQuotes(result));
//         })
//         .catch(errorHandler);
// };

/**
 * Google Finance API
 * makeQuotesUrl, processQuotes, fetchQuotes functions
 * URL: http://finance.google.com/finance/info?client=ig&q=NASDAQ:YHOO,NASDAQ:GOOGL
 */

// Moved to backend
// const makeQuotesUrl = symbols => {
//     symbols = symbols.map(x => {
//         return x.exch ? `${x.exch}:${x.symbol}` : x.symbol;
//     });
//     let symbolsStr = symbols.join(',');
//     let url = BASE_URI + "quotes";
//     let params = {
//         q: symbolsStr
//     };
//     return makeUrl(url, params);
// };

/**
 * Google API properties http://www.jarloo.com/real-time-google-stock-api/
 * t   Ticker
 * e   Exchange
 * l   Last Price
 * ltt Last Trade Time
 * l   Price
 * lt  Last Trade Time Formatted
 * lt_dts  Last Trade Date/Time
 * c   Change
 * cp  Change Percentage
 * el  After Hours Last Price
 * elt After Hours Last Trade Time Formatted
 * div Dividend
 * yld Dividend Yield
 */
const processQuotes = quotes => {
    // always return an Array.
    quotes = Array.isArray(quotes) ? quotes : [quotes];
    // convert to object map
    let result = {};
    quotes.forEach(quote => {
        const { t: symbol, l: current_price, c: change, cp: change_percent} = quote;
        result[symbol] = {
            symbol,
            current_price,
            change,
            change_percent: change_percent / 100,
            $original: quote
        };
    });
    return result;
};

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
const fetchQuotes = symbols => {
    if (!(symbols && Array.isArray(symbols) && symbols.length)) {
        // empty symbols, skip fetching
        return Promise.resolve([]);
    }
    return $.ajax({
        type: 'GET',
        dataType: 'json',
        url: __MY_API__ + 'quotes',
        data: {symbols: JSON.stringify(symbols)},
        headers: {
            Authorization: `Bearer ${Auth.getToken()}`
        },
        timeout: 3000
    })
    .then(data => {
        if (!data.success) {
            return null;
        }
        return processQuotes(data.result);
    })
    .catch(errorHandler);
};

const fetchCurrency = (holdings, displayCurrency) => {
    let currencyPairs = [];
    holdings.forEach(x => {
        let pair = x.currency + displayCurrency;
        if (x.currency !== displayCurrency && currencyPairs.indexOf(pair) === -1) {
            currencyPairs.push(pair);
        }
    });
    return currencyActions.fetchCurrency(currencyPairs);
};

export const refreshQuotes = () => (dispatch, getState) => {
    const state = getState();
    const holdings = getHoldings(state);
    const displayCurrency = state.portfolio.displayCurrency;

    dispatch(batchActions([
        requestQuotes(),
        currencyActions.requestCurrency()
    ]));

    let quotePromise = fetchQuotes(holdings.map(x => ({
        symbol: x.symbol,
        exch: x.exch
    })));
    let currencyPromise = fetchCurrency(holdings, displayCurrency);

    Promise.timeout(REFRESH_QUOTES_TIMEOUT, Promise.all([quotePromise, currencyPromise]))
    .then(([quotes, currency]) => {
        // Dispatch two receive actions together to avoid updating components twice.
        dispatch(batchActions([
            receiveQuotes(quotes),
            currencyActions.receiveCurrency(currency)
        ]));
    }).catch((/*error*/) => {
        dispatch(batchActions([
            requestQuotesTimeout(),
            currencyActions.requestCurrencyTimeout()
        ]));
    });
};

export const setIntervalRefreshQuotes = () => (dispatch, getState) => {
    setInterval(refreshQuotes().bind(null, dispatch, getState), REFRESH_QUOTES_INTERVAL);
};