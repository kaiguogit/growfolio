import * as types from '../constants/actionTypes';

export const updateBalanceAllocation = allocation => ({
    type: types.UPDATE_BALANCE_ALLOCATION,
    symbol: allocation.symbol,
    percentage: allocation.percentage
});
