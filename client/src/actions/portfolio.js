import types from '../constants/actionTypes';
import * as persist from '../utils/persist';

export const getSelectDisplayCurrency = () => {
    let displayCurrency = persist.get(types.SELECT_DISPLAY_CURRENCY);
    return {
        type: types.SELECT_DISPLAY_CURRENCY,
        displayCurrency
    };
};

export const selectDisplayCurrency = displayCurrency => {
    persist.put(types.SELECT_DISPLAY_CURRENCY, displayCurrency);
    return {
        type: types.SELECT_DISPLAY_CURRENCY,
        displayCurrency
    };
};

export const getSelectDisplayAccount = () => {
    let displayAccount = persist.get(types.SELECT_DISPLAY_ACCOUNT);
    return {
        type: types.SELECT_DISPLAY_ACCOUNT,
        displayAccount
    };
};

export const selectDisplayAccount = displayAccount => {
    persist.put(types.SELECT_DISPLAY_ACCOUNT, displayAccount);
    return {
        type: types.SELECT_DISPLAY_ACCOUNT,
        displayAccount
    };
};

export const getShowZeroShareHolding = () => {
    let value = persist.get(types.SHOW_ZERO_SHARE_HOLDING);
    return {
        type: types.SHOW_ZERO_SHARE_HOLDING,
        showZeroShareHolding: value
    };
};

export const setShowZeroShareHolding = value => {
    persist.put(types.SHOW_ZERO_SHARE_HOLDING, value);
    return {
        type: types.SHOW_ZERO_SHARE_HOLDING,
        showZeroShareHolding: value
    };
};
