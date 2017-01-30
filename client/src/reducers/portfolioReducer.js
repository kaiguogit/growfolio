import * as types from '../constants/actionTypes';
import initialState from './initialState';

const portfolioReducer = (state = initialState.portfolio, action) => {
    switch (action.type) {
        case types.SELECT_TAB:
            return {
                ...state,
                tab: action.tab
            };
        case types.SELECT_DISPLAY_CURRENCY:
            return {
                ...state,
                displayCurrency: action.displayCurrency
            };
        default:
            return state;
    }
};

export default portfolioReducer;
