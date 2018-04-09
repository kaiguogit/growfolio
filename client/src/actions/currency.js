import types from '../constants/actionTypes';
import { log } from '../utils';
// import fakeExchangeRate from './fixtures/exchangeRate';
import { makeActionCreator, callAPI } from './utils';

export const requestCurrency = makeActionCreator(types.REQUEST_CURRENCY);
export const requestCurrencyTimeout = makeActionCreator(types.REQUEST_CURRENCY_TIMEOUT);

export const receiveCurrency = makeActionCreator(types.RECEIVE_CURRENCY, 'rate');

const processAPIResponse = (response) => {
    if (response) {
        const from = response.fromCurrency;
        const to = response.toCurrency;
        const rate = response.rate;
        return {
            [from + to]: rate
        };
    }
};

/**
 * Fetch currency based on holdings and displayCurrency
 * @param {object} state
 * @returns {promise} fetch currency promise
 */
export const fetchCurrency = () => (dispatch) => {
    dispatch(requestCurrency());
    // return Promise.resolve(fakeExchangeRate)
    return callAPI(__MY_API__ + 'exchange-rate')
    .then(processAPIResponse).then((result) => {
        dispatch(receiveCurrency(result));
    }).catch(error => {
        log.error(error);
    });
};
