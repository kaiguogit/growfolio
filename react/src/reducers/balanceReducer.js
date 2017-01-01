import * as types from '../constants/actionTypes';
import initialState from './initialState';
const balanceReducer = (state=initialState.balance, action) => {
    switch(action.type) {
        case types.UPDATE_BALANCE_ALLOCATION: {
            return {
                ...state,
                [action.symbol]: +action.percentage
            };
        }
        default:
            return state;
    }
};

export default balanceReducer;