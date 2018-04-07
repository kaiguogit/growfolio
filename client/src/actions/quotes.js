import types from '../constants/actionTypes';
import Auth from '../services/Auth';
import { num, log, getHeaders } from '../utils';

import * as currencyActions from './currency';
import { batchActions } from './';
import { getHoldings, getRealTimeRate } from '../selectors';
import { makeActionCreator } from './utils';
// import fakeQuotes from './fixtures/quotes';

const REFRESH_QUOTES_INTERVAL = 600000;
const REFRESH_QUOTES_TIMEOUT = 3000;

export const requestQuotes = makeActionCreator(types.REQUEST_QUOTES);
export const requestQuotesTimeout = makeActionCreator(types.REQUEST_QUOTES_TIMEOUT);
export const setDisplayDate = makeActionCreator(types.SET_QUOTE_DISPLAY_DATE, 'displayDate');
export const receiveQuotes = makeActionCreator(types.RECEIVE_QUOTES, 'data', 'meta');

export const setQuoteDisplayDate = date => {
    return batchActions([
        setDisplayDate(date),
        refreshQuotes()
    ]);
};

export const setUseHistoricalQuote = makeActionCreator(types.SET_USE_HISTORICAL_QUOTE, 'date');
export const toggleQuoteModal = makeActionCreator(types.TOGGLE_QUOTE_MODAL, 'showModal', 'quote');

const callAPI = (url) => {
    return fetch(url, {headers: getHeaders()})
    .then(response => response.json())
    .then(response => {
        if (!response.success) {
            return Promise.reject(response);
        }
        return response;
    })
    .then((data) => data.result);
};

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
const fetchQuotes = state => {
    const holdings = getHoldings(state);
    const symbols = holdings.map(holding => {
        return holding.isUSD() ? holding.symbol : 'TSX:' + holding.symbol;
    }).join(',');

    return callAPI(__MY_API__ + 'quotes?symbols=' + symbols);
};


export const createQuote = quote => (dispatch, getState) => {
    dispatch(requestQuotes());
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
    let currency;
    Promise.timeout(REFRESH_QUOTES_TIMEOUT * holdings.length,
        currencyPromise.delay(1000).then((data) => {
            currency = data;
            return fetchQuotes(state);
        }))
    .then(quotes => {
        if (shouldRequestRate) {
            // Dispatch two receive actions together to avoid updating components twice.
            dispatch(batchActions([
                receiveQuotes(quotes.data, quotes.meta),
                currencyActions.receiveCurrency(currency)
            ]));
        } else {
            dispatch(receiveQuotes(quotes.data, quotes.meta));
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
