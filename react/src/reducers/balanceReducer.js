import * as types from '../constants/actionTypes';
import initialState from './initialState';

const updateHolding = (state, action) => {
    switch(action.type) {
        case types.UPDATE_BALANCE_LABEL:
            return {
                ...state,
                label: action.label
            };
        case types.UPDATE_BALANCE_PERCENTAGE:
            return {
                ...state,
                percentage: action.percentage
            };
        default:
            return state;
    }
};

const balanceReducer = (state=initialState.balance, action) => {
    switch(action.type) {
        case types.UPDATE_BALANCE_LABEL:
        case types.UPDATE_BALANCE_PERCENTAGE:
            return {
                ...state,
                [action.symbol]: updateHolding(state[action.symbol], action)
            };
        default:
            return state;
    }
};

export default balanceReducer;