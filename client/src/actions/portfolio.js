import types from '../constants/actionTypes';

export const selectDisplayCurrency = displayCurrency => ({
    type: types.SELECT_DISPLAY_CURRENCY,
    displayCurrency
});

export const selectDisplayAccount = displayAccount => ({
    type: types.SELECT_DISPLAY_ACCOUNT,
    displayAccount
});

export const showZeroShareHolding = value => ({
    type: types.SHOW_ZERO_SHARE_HOLDING,
    showZeroShareHolding: value
});