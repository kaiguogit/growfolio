import types from '../constants/actionTypes';
import { log, getHeaders } from '../utils';
import * as currencyActions from './currency';
import { getHoldingsAfterZeroShareFilter } from '../selectors';
import { makeActionCreator, callAPI } from './utils';
// import fakeQuotes from './fixtures/quotes';
import moment from 'moment-timezone';

const REFRESH_QUOTES_INTERVAL = 600000;

export const requestQuotes = makeActionCreator(types.REQUEST_QUOTES, 'symbol');
export const requestQuotesTimeout = makeActionCreator(types.REQUEST_QUOTES_TIMEOUT);
export const setQuoteDisplayDate = date => {
    return {
        type: types.SET_QUOTE_DISPLAY_DATE,
        displayDate: moment(date)
    };
};

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
    const holdings = getHoldingsAfterZeroShareFilter(getState());
    const symbols = holdings.map(holding => {
        return holding.symbol;
    });
    return callAPI(__MY_API__ + 'download-quotes?' + new URLSearchParams({
        symbols: symbols.join(',')
    })).then((quote) => {
        dispatch(receiveQuotes(quote.data, quote.meta));
    }).catch(log.error).then(() => {
        dispatch(receiveQuotes());
    });
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
