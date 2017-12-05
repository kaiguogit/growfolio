import types from '../constants/actionTypes';
import initialState from './initialState';

const currencyReducer = (state = initialState.currency, action) => {
    switch(action.type) {
        case types.REQUEST_CURRENCY:
            return {
                ...state,
                isFetching: true
            };
        case types.RECEIVE_CURRENCY:
            return {
                ...state,
                isFetching: false,
                rate: action.rate || [],
                lastUpdated: action.receivedAt
            };
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