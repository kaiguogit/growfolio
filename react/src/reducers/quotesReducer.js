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
            // console.log("Equaliy check: previous quote and new quotes are:",
                // isEqual(state.items, action.quotes) ? "same" : "different" );
            return {
                ...state,
                isFetching: false,
                items: action.quotes,
                lastUpdated: action.receivedAt
            };
        default:
            return state;
    }
};

export default quotesReducer;

