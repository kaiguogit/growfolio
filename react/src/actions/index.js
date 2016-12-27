import * as types from '../constants/actionTypes';

export const selectTab = (tab) => ({
    type: types.SELECT_TAB,
    tab
});