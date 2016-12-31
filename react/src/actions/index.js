import * as types from '../constants/actionTypes';

export const selectTab = (tab) => ({
    type: types.SELECT_TAB,
    tab
});

export const selectDisplayCurrency = displayCurrency => ({
    type: types.SELECT_DISPLAY_CURRENCY,
    displayCurrency,
});