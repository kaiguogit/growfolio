import * as types from '../constants/actionTypes';
import { makeUrl } from '../utils';
import { getHoldings } from '../selectors';

export const requestCurrency = () => ({
    type: types.REQUEST_CURRENCY
});

export const requestCurrencyTimeout = () => ({
    type: types.REQUEST_CURRENCY_TIMEOUT
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

/**
 * Generate currency pairs array based on holding's currency,
 * displaycurrency setting and currency watchlist
 * @param {object} state
 * @return {array} array of string e.g ['CADCNY', 'CADUSD']
 */
const getCurrencyPairs = (state) => {
    const holdings = getHoldings(state);
    const watchList = state.currency.watchList;
    const displayCurrency = state.portfolio.displayCurrency;
    const currencyPairs = [];

    watchList.forEach(currencyId => {
        // TODO hard coded as CAD for now, add support changing base
        // currency.
        currencyPairs.push('CAD' + currencyId);
    });

    holdings.forEach(holding => {
        let pair = holding.currency + displayCurrency;
        if (holding.currency !== displayCurrency && currencyPairs.indexOf(pair) === -1) {
            currencyPairs.push(pair);
        }
    });
    return currencyPairs;
};

/**
 * Fetch currency based on holdings and displayCurrency
 * @param {object} state
 * @returns {promise} fetch currency promise
 */
export const fetchCurrency = (state) => {
    const currencyPairs = getCurrencyPairs(state);
    if (!currencyPairs.length) {
        // empty currencyPairs, skip fetching
        return Promise.resolve([]);
    }
    return fetch(makeCurrencyUrl(currencyPairs))
        .then(response => response.json())
        .then(data => {
            return processRate(data);
        });
};
