import initialState from './initialState';
import types from '../constants/actionTypes';
const quotesReducer = (state = initialState.quotes, action) => {
    switch (action.type) {
        case types.ADD_QUOTE:
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
        case types.SET_QUOTE_DISPLAY_DATE:
            return {
                ...state,
                displayDate: action.date
            };
        case types.SET_USE_HISTORICAL_QUOTE:
            return {
                ...state,
                useHistoricalQuote: action.useHistoricalQuote
            };
        case types.TOGGLE_QUOTE_MODAL:
            return {
                ...state,
                dialogModal: {
                    isOpened: !!action.showModal,
                    quote: action.quote ? Object.assign({}, action.quote) : null
                }
            };
        default:
            return state;
    }
};

export default quotesReducer;

