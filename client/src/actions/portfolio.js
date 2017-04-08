import * as types from '../constants/actionTypes';

export const selectDisplayCurrency = displayCurrency => ({
    type: types.SELECT_DISPLAY_CURRENCY,
    displayCurrency
});

export const showZeroShareHolding = value => ({
    type: types.SHOW_ZERO_SHARE_HOLDING,
    showZeroShareHolding: value
});