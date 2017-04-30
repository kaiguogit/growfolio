import * as types from '../constants/actionTypes';
import initialState from './initialState';

const updateHolding = (state, action) => {
    switch(action.type) {
        case types.UPDATE_BALANCE_LABEL:
        case types.RECEIVE_ALLOCATIONS:
        case types.UPDATE_BALANCE_PERCENTAGE:
            return {
                ...state,
                symbol: action.symbol || (state && state.symbol),
                label: action.label || (state && state.label),
                percentage: action.percentage || (state && state.percentage)
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
        case types.RECEIVE_ALLOCATIONS: {
            let newState = {};
            action.allocations.forEach(allocation => {
                newState[allocation.symbol] = updateHolding(
                    state[allocation.symbol],
                    {
                        ...allocation,
                        type: types.RECEIVE_ALLOCATIONS
                    }
                );
            });
            return newState;
        }
        case types.ADD_ALLOCATIONS:
        default:
            return state;
    }
};

export default balanceReducer;