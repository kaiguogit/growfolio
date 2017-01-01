import * as types from '../constants/actionTypes';

export const updateBalancePercentage = holding => ({
    type: types.UPDATE_BALANCE_PERCENTAGE,
    symbol: holding.symbol,
    percentage: +holding.percentage
});

export const updateBalanceLabel = holding => ({
    type: types.UPDATE_BALANCE_LABEL,
    symbol: holding.symbol,
    label: holding.label
});