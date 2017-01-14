import * as types from '../constants/actionTypes';
import $ from 'jquery';

import { makeUrl, errorHandler } from '../utils';
export const requestQuotes = () => ({
    type: types.REQUEST_QUOTES
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

// __MY_API__ is set in webpack globals
const BASE_URI = __MY_API__;

/**
 * Google Finance API
 * makeQuotesUrl, processQuotes, fetchQuotes functions
 * URL: http://finance.google.com/finance/info?client=ig&q=NASDAQ:YHOO,NASDAQ:GOOGL
 */
const makeQuotesUrl = symbols => {
    symbols = symbols.map(x => {
        return x.exch ? `${x.exch}:${x.symbol}` : x.symbol;
    });
    let symbolsStr = symbols.join(',');
    let url = BASE_URI + "quotes";
    let params = {
        q: symbolsStr
    };
    return makeUrl(url, params);
};

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
export const fetchQuotes = symbols => dispatch => {
    if (!(symbols && Array.isArray(symbols) && symbols.length)) {
        // empty symbols, skip fetching
        return;
    }
    dispatch(requestQuotes());
    return $.ajax({
        TYPE: 'GET',
        url: makeQuotesUrl(symbols)
    }).then(jsonStr => {
        return JSON.parse(jsonStr.response);
    })
    .then(data => {
        let result = processQuotes(data);
        dispatch(receiveQuotes(result));
    })
    .catch(errorHandler);
};
