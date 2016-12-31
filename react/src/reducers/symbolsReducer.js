import * as types from '../constants/actionTypes';
import initialState from './initialState';

const symbolsReducer = (state=initialState.symbols, action) => {
    switch(action.type) {
        case types.REQUEST_SYMBOLS:
            return {
                ...state,
                isFetching: true
            };
        case types.RECEIVE_SYMBOLS:
            return {
                ...state,
                isFetching: false,
                items: action.symbols,
                query: action.query
            };
        default:
            return state;
    }
};

export default symbolsReducer;