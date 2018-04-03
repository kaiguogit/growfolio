import types from '../constants/actionTypes';
import initialState from './initialState';

const portfolioReducer = (state = initialState.portfolio, action) => {
    switch (action.type) {
        case types.SELECT_DISPLAY_CURRENCY:
            if (action.displayCurrency != undefined) {
                return {
                    ...state,
                    displayCurrency: action.displayCurrency
                };
            }
            return state;
        case types.SELECT_DISPLAY_ACCOUNT:
            if (action.displayAccount != undefined) {
                return {
                    ...state,
                    displayAccount: action.displayAccount
                };
            }
            return state;
        case types.SHOW_ZERO_SHARE_HOLDING:
            if (action.showZeroShareHolding != undefined) {
                return {
                    ...state,
                    showZeroShareHolding: action.showZeroShareHolding
                };
            }
            return state;
        default:
            return state;
    }
};

export default portfolioReducer;
