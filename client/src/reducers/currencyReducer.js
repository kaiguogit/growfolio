import types from '../constants/actionTypes';
import initialState from './initialState';
import merge from 'lodash/merge';

const currencyReducer = (state = initialState.currency, action) => {
    switch(action.type) {
        case types.REQUEST_CURRENCY:
            return {
                ...state,
                isFetching: true
            };
        case types.RECEIVE_CURRENCY: {
            let rate = state.rate;
            let lastUpdated = state.lastUpdated;
            if (action.rate) {
                rate = merge({}, rate, action.rate);
                lastUpdated = Date.now();
            }
            return {
                ...state,
                rate,
                isFetching: false,
                lastUpdated
            };
        }
        case types.REQUEST_CURRENCY_TIMEOUT:
            return {
                ...state,
                isFetching: false
            };
        default:
            return state;
    }
};

export default currencyReducer;