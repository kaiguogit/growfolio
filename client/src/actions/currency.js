import * as types from '../constants/actionTypes';
import { makeUrl, errorHandler } from '../utils';

export const requestCurrency = () => ({
    type: types.REQUEST_CURRENCY
});


export const receiveCurrency = (rate) => ({
    type: types.RECEIVE_CURRENCY,
    receivedAt: Date.now(),
    rate
});

/**
 * YAHOO Finance API version
 * makeQuotesUrl, processQuotes, fetchQuotes functions
 */
const makeCurrencyUrl = currencyPairs => {
    // concat symbols into \"USDCAD\",\"USDCNY\"
    let currencyPairsStr = currencyPairs.map((symbol) => '\"' + symbol + '\"').join(',');
    let url = 'https://query.yahooapis.com/v1/public/yql';
    let params = {
      q: `select * from yahoo.finance.xchange where pair in (${currencyPairsStr})`,
      format:'json',
      diagnostics: 'true',
      env: 'store://datatables.org/alltableswithkeys',
      callback: ''
    };
    return makeUrl(url, params);
};

const processRate = data => {
    let rate = data.query.results.rate;
    // always return an Array.
    return Array.isArray(rate) ? rate : [rate];
};

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */

// DUMMY VERSION
// export const fetchCurrency = () => dispatch => {
//     dispatch(requestCurrency());
//     setTimeout(()=> {
//         dispatch(receiveCurrency(1.3));
//     }, 1000);
// };

export const fetchCurrency = currencyPairs => {
    if (!(currencyPairs && Array.isArray(currencyPairs) && currencyPairs.length)) {
        // console.log("empty currencyPairs, skip fetching");
        // empty currencyPairs, skip fetching
        return Promise.resolve([]);
    }
    return fetch(makeCurrencyUrl(currencyPairs))
        .then(response => response.json())
        .then(data => {
            return processRate(data);
        })
        .catch(errorHandler);
};