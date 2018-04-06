import types from '../constants/actionTypes';
import Auth from '../services/Auth';
import { num, log, getHeaders } from '../utils';

import * as currencyActions from './currency';
import { batchActions } from './';
import { getHoldings, getRealTimeRate } from '../selectors';
// import fakeQuotes from './fixtures/quotes';

const REFRESH_QUOTES_INTERVAL = 600000;
const REFRESH_QUOTES_TIMEOUT = 3000;

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

export const receiveRealTimeQuotes = (quotes) => ({
    type: types.RECEIVE_REAL_TIME_QUOTES,
    receivedAt: Date.now(),
    quotes
});

export const setQuoteDisplayDate = date => dispatch => {
    let setDate = (date) => ({
        type: types.SET_QUOTE_DISPLAY_DATE,
        date
    });
    dispatch(batchActions([
        setDate(date),
        refreshQuotes()
    ]));
};

export const setUseHistoricalQuote = (date) => ({
    type: types.SET_USE_HISTORICAL_QUOTE,
    date
});

export const toggleQuoteModal = (showModal, quote) => ({
    type: types.TOGGLE_QUOTE_MODAL,
    showModal,
    quote
});

const processHistoricalQutes = quotes => {
    if (quotes) {
        return quotes.reduce((result, quote) => {
            result[quote.symbol] = result[quote.symbol] || {};
            result[quote.symbol][quote.date] = quote;
            return result;
        }, {});
    }
};

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
const fetchQuotes = state => {
    if (state.quotes.useHistoricalQuote) {
        return fetchHistoricalQuotes(state);
    }
    return fetchRealTimeQuotes(state);
};

const fetchRealTimeQuotes = state => {
    const holdings = getHoldings(state);
    const result = {};
    return holdings.reduce((prev, next, index) => {
        const request = () => {
            return requestRealTimeQuotes(next)
            .then(quotes => {
                const temp = Object.assign(result, {
                    [next.symbol]: quotes
                });
                return temp;
            }).catch(log.error);
        };
        if (!index) {
            return prev.then(request);
        }
        return prev.delay(1000).then(request);
    }, Promise.resolve());
};

const requestRealTimeQuotes = (holding) => {
    const symbol = holding.isUSD() ? holding.symbol : 'TSX:' + holding.symbol;

    // return Promise.resolve(fakeQuotes)
    return fetch(__MY_API__ + 'real-time-quotes?symbol=' + symbol, {
        headers: getHeaders()
    }).then(response => response.json())
    .then(response => {
        if (!response.success) {
            return Promise.reject(response);
        }
        return response;
    })
    .then((data) => data.result);
};

const fetchHistoricalQuotes = () => {
    return fetch(__MY_API__ + 'historical-quotes', {
        headers: getHeaders()
    }).then(response => response.json())
    .then(data => {
        return processHistoricalQutes(data.result);
    });
};

export const createQuote = quote => (dispatch, getState) => {
    dispatch({
        type: types.ADD_QUOTE
    });
    let quoteDate = getState().quotes.displayDate;
    let quoteDateStr = quoteDate.format('MM-DD-YYYY');
    quote.date = quoteDateStr;
    return fetch(__MY_API__ + 'historical-quotes', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(quote)
    }).then(response => response.json())
    .then(() => refreshQuotes()(dispatch, getState))
    .catch(log.error);
};

export const refreshQuotes = () => (dispatch, getState) => {
    const state = getState();
    const rate = getRealTimeRate(state);
    const holdings = getHoldings(state);
    const shouldRequestRate = rate.USDCAD === 1;
    if (shouldRequestRate) {
        dispatch(batchActions([
            requestQuotes(),
            currencyActions.requestCurrency()
        ]));
    } else {
        dispatch(requestQuotes());
    }

    let currencyPromise = shouldRequestRate ? currencyActions.fetchCurrency(state): Promise.resolve();
    const receiveQuotesAction = state.quotes.useHistoricalQuote ? receiveQuotes : receiveRealTimeQuotes;
    let currency;
    Promise.timeout(REFRESH_QUOTES_TIMEOUT * holdings.length,
        currencyPromise.delay(1000).then((data) => {
            currency = data;
            return fetchQuotes(state);
        }))
    .then(quotes => {
        // Dispatch two receive actions together to avoid updating components twice.
        if (shouldRequestRate) {
            dispatch(batchActions([
                receiveQuotesAction(quotes),
                currencyActions.receiveCurrency(currency)
            ]));
        } else {
            dispatch(receiveQuotesAction(quotes));
        }
    }).catch((error) => {
        log.error(error);
        dispatch(batchActions([
            requestQuotesTimeout(),
            currencyActions.requestCurrencyTimeout()
        ]));
    });
};

export const setIntervalRefreshQuotes = () => (dispatch, getState) => {
    setInterval(refreshQuotes().bind(null, dispatch, getState), REFRESH_QUOTES_INTERVAL);
};

const requestDownloadQuotes = (holding) => {
    const symbol = holding.isUSD() ? holding.symbol : 'TSX:' + holding.symbol;

    // return Promise.resolve(fakeQuotes)
    return fetch(__MY_API__ + 'download-historical-quotes', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({symbol})
    }).then(response => response.json())
    .then(response => {
        if (!response.success) {
            return Promise.reject(response);
        }
        return response;
    })
    .then((data) => processHistoricalQutes(data.result));
};

export const downloadQuotes = () => (dispatch, getState) => {
    const state = getState();
    const holdings = getHoldings(state);
    holdings.reduce((prev, next, index) => {
        const request = () => {
            return requestDownloadQuotes(next)
            .then(quotes => dispatch(receiveQuotes(quotes)))
            .catch(log.error);
        };
        if (!index) {
            return prev.then(request);
        }
        return prev.delay(1000).then(request);
    }, Promise.resolve());
};
