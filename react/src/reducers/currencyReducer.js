import * as types from '../constants/actionTypes';
import initialState from './initialState';
import isEqual from 'lodash.isequal';

const currencyReducer = (state = initialState.currency, action) => {
    switch(action.type) {
        case types.REQUEST_CURRENCY:
            return {
                ...state,
                isFetching: true
            };
        case types.RECEIVE_CURRENCY:
            console.log("Equaliy check: previous currency and new currency are:",
                isEqual(state.rate, action.rate) ? "same" : "different" );
            return {
                ...state,
                isFetching: false,
                rate: action.rate,
                lastUpdated: action.receivedAt
            };
        default:
            return state;
    }
};

export default currencyReducer;