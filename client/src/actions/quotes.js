import types from '../constants/actionTypes';
import { log, getHeaders } from '../utils';
import * as currencyActions from './currency';
import { batchActions } from './';
import { getHoldings } from '../selectors';
import { makeActionCreator, callAPI } from './utils';
// import fakeQuotes from './fixtures/quotes';

const REFRESH_QUOTES_INTERVAL = 600000;

export const requestQuotes = makeActionCreator(types.REQUEST_QUOTES);
export const requestQuotesTimeout = makeActionCreator(types.REQUEST_QUOTES_TIMEOUT);
export const setDisplayDate = makeActionCreator(types.SET_QUOTE_DISPLAY_DATE, 'displayDate');
export const receiveQuotes = makeActionCreator(types.RECEIVE_QUOTES, 'data', 'meta');
export const receiveSingleQuote = makeActionCreator(types.RECEIVE_SINGLE_QUOTE, 'data', 'meta');

export const setQuoteDisplayDate = date => {
    return batchActions([
        setDisplayDate(date),
        refreshQuotes()
    ]);
};

export const setUseHistoricalQuote = makeActionCreator(types.SET_USE_HISTORICAL_QUOTE, 'date');
export const toggleQuoteModal = makeActionCreator(types.TOGGLE_QUOTE_MODAL, 'showModal', 'quote');

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
const fetchQuotes = () => (dispatch, getState) => {
    const holdings = getHoldings(getState()).filter(holding => {
        return holding.shares.CAD;
    });
    dispatch(requestQuotes());
    return holdings.reduce((previous, holding) => {
        let symbol = holding.isUSD() ? holding.symbol : 'TSX:' + holding.symbol;
        return previous.then(() => {return fetchSingleQuote(symbol, dispatch);});
    }, Promise.resolve()).then(() => {
        dispatch(receiveQuotes());
    });
};

const fetchSingleQuote = (symbol, dispatch) => {
    return callAPI(__MY_API__ + 'quotes?symbols=' + symbol).then((quote) => {
        dispatch(receiveSingleQuote(quote.data, quote.meta));
    }).catch(log.error);
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

export const refreshQuotes = () => (dispatch) => {
    dispatch(currencyActions.fetchCurrency());
    dispatch(fetchQuotes());
};

export const setIntervalRefreshQuotes = () => (dispatch, getState) => {
    setInterval(refreshQuotes().bind(null, dispatch, getState), REFRESH_QUOTES_INTERVAL);
};
