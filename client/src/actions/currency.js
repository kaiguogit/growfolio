import types from '../constants/actionTypes';
import { makeUrl, num, log, getHeaders} from '../utils';
import { getHoldings } from '../selectors';
import fakeExchangeRate from './fakeData/exchangeRate';

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

const processAPIResponse = (response) => {
    if (response.result) {
        const result = response.result;
        const from = result['From_Currency Code'];
        const to = result['To_Currency Code'];
        const rate = result['Exchange Rate'];
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
export const fetchCurrency = () => {
    return Promise.resolve(fakeExchangeRate)
    // return fetch(__MY_API__ + 'exchange-rate', {
    //     headers: getHeaders()
    // }).then(response => response.json())
    .then(processAPIResponse).catch(error => {
        log.error(error);
    });
};
