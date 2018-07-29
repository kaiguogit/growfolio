import types from '../constants/actionTypes';
import { log } from '../utils';
// import fakeExchangeRate from './fixtures/exchangeRate';
import { makeActionCreator, callAPI } from './utils';

export const requestCurrency = makeActionCreator(types.REQUEST_CURRENCY);
export const requestCurrencyTimeout = makeActionCreator(types.REQUEST_CURRENCY_TIMEOUT);

export const receiveCurrency = makeActionCreator(types.RECEIVE_CURRENCY, 'data');


/**
 * Fetch currency based on holdings and displayCurrency
 * @param {object} state
 * @returns {promise} fetch currency promise
 */
export const fetchCurrency = () => (dispatch) => {
    dispatch(requestCurrency());
    // return Promise.resolve(fakeExchangeRate)
    return callAPI(__MY_API__ + 'exchange-rate')
    .then((result) => {
        dispatch(receiveCurrency(result));
    }).catch(error => {
        log.error(error);
    });
};

/**
 * Fetch currency based on holdings and displayCurrency
 * @param {object} state
 * @returns {promise} fetch currency promise
 */
export const downloadCurrency = () => (dispatch) => {
    dispatch(requestCurrency());
    // return Promise.resolve(fakeExchangeRate)
    return callAPI(__MY_API__ + 'download-exchange-rate', {
        method: 'POST'
    })
    .then((result) => {
        dispatch(receiveCurrency(result));
    }).catch(error => {
        log.error(error);
    });
};