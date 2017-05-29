import initialState from './initialState';
import * as types from '../constants/actionTypes';
// import isEqual from 'lodash.isequal';
const quotesReducer = (state = initialState.quotes, action) => {
    switch (action.type) {
        case types.REQUEST_QUOTES:
            return {
                ...state,
                isFetching: true
            };
        case types.RECEIVE_QUOTES:
            // if fetch quote failed, don't change.
            return {
                ...state,
                isFetching: false,
                items: action.quotes || state.items,
                lastUpdated: action.receivedAt
            };
        case types.REQUEST_QUOTES_TIMEOUT:
            return {
                ...state,
                isFetching: false
            };
        default:
            return state;
    }
};

export default quotesReducer;

