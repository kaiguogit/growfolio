import types from '../constants/actionTypes';
import { log, getHeaders } from '../utils';
import * as currencyActions from './currency';
import { getHoldings } from '../selectors';
import { makeActionCreator, callAPI } from './utils';
// import fakeQuotes from './fixtures/quotes';

const REFRESH_QUOTES_INTERVAL = 600000;

export const requestQuotes = makeActionCreator(types.REQUEST_QUOTES, 'symbol');
export const requestQuotesTimeout = makeActionCreator(types.REQUEST_QUOTES_TIMEOUT);
export const setQuoteDisplayDate = makeActionCreator(types.SET_QUOTE_DISPLAY_DATE, 'displayDate');
export const receiveQuotes = makeActionCreator(types.RECEIVE_QUOTES, 'data', 'meta');
export const receiveSingleQuote = makeActionCreator(types.RECEIVE_SINGLE_QUOTE, 'data', 'meta');

export const setUseHistoricalQuote = makeActionCreator(types.SET_USE_HISTORICAL_QUOTE, 'date');
export const toggleQuoteModal = makeActionCreator(types.TOGGLE_QUOTE_MODAL, 'showModal', 'quote');

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
const fetchQuotes = (download) => (dispatch, getState) => {
    dispatch(requestQuotes());
    if (download) {
        return downloadQuote(dispatch, getState);
    }
    return callAPI(__MY_API__ + 'quotes').then((quote) => {
        dispatch(receiveQuotes(quote.data, quote.meta));
    }).catch(log.error);
};

const downloadQuote = (dispatch, getState) => {
    const holdings = getHoldings(getState()).filter(holding => {
        return holding.shares.CAD;
    });
    return holdings.reduce((previous, holding) => {
        dispatch(requestQuotes(holding.symbol));
        let symbol = holding.isUSD() ? holding.symbol : 'TSX:' + holding.symbol;
        return previous.then(() => {return fetchSingleQuote(symbol, dispatch);});
    }, Promise.resolve()).then(() => {
        dispatch(receiveQuotes());
    });
};

const fetchSingleQuote = (symbol, dispatch) => {
    return callAPI(__MY_API__ + 'download-quotes?symbols=' + symbol).then((quote) => {
        dispatch(receiveSingleQuote(quote.data, quote.meta));
    }).catch(log.error);
};

export const createQuote = quote => (dispatch, getState) => {
    dispatch(requestQuotes());
    let quoteDate = getState().quotes.displayDate;
    let quoteDateStr = quoteDate.format('YYYY-MM-DD');
    quote.date = quoteDateStr;
    return fetch(__MY_API__ + 'quotes', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(quote)
    }).then(response => response.json())
    .then(() => fetchQuotes()(dispatch, getState))
    .catch(log.error);
};

export const refreshQuotes = (download) => (dispatch) => {
    dispatch(currencyActions.fetchCurrency());
    dispatch(fetchQuotes(download));
};

export const setIntervalRefreshQuotes = () => (dispatch, getState) => {
    setInterval(refreshQuotes().bind(null, dispatch, getState), REFRESH_QUOTES_INTERVAL);
};
