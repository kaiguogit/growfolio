import types from '../constants/actionTypes';
import initialState from './initialState';

const portfolioReducer = (state = initialState.portfolio, action) => {
    switch (action.type) {
        case types.SELECT_DISPLAY_CURRENCY:
            return {
                ...state,
                displayCurrency: action.displayCurrency
            };
        case types.SELECT_DISPLAY_ACCOUNT:
            return {
                ...state,
                displayAccount: action.displayAccount
            };
        case types.SHOW_ZERO_SHARE_HOLDING:
            return {
                ...state,
                showZeroShareHolding: action.showZeroShareHolding
            };
        default:
            return state;
    }
};

export default portfolioReducer;
