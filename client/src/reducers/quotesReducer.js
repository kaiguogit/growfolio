'use strict';

import initialState from './initialState';
import types from '../constants/actionTypes';
import {createReducer, setValueFromAction, mergeObjectFromAction} from './reducerUtils';
import reduceReducers from 'reduce-reducers';

const stopFetching = state => {
    return {
        ...state,
        isFetching: false,
        fetchingSymbol: '',
    };
};

const quotesReducer = createReducer(initialState.quotes, {
    [types.REQUEST_QUOTES]: (state, action) => {
        return {
            ...state,
            isFetching: true,
            fetchingSymbol: action.symbol,
        };
    },
    [types.REQUEST_QUOTES_TIMEOUT]: stopFetching,
    [types.SET_QUOTE_DISPLAY_DATE]: setValueFromAction('displayDate'),
    [types.SET_USE_HISTORICAL_QUOTE]: setValueFromAction('useHistoricalQuote'),
    [types.TOGGLE_QUOTE_MODAL]: toggleModel,
    [types.RECEIVE_SINGLE_QUOTE]: reduceReducers(
        mergeObjectFromAction('data'),
        mergeObjectFromAction('meta'),
    ),
    [types.RECEIVE_QUOTES]: reduceReducers(
        stopFetching,
        mergeObjectFromAction('data'),
        mergeObjectFromAction('meta'),
    )
});

const toggleModel = (state, action) => {
    return {
        ...state,
        dialogModal: {
            isOpened: !!action.showModal,
            quote: action.quote ? Object.assign({}, action.quote) : null
        }
    };
};

export default quotesReducer;
