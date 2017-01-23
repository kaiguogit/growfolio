import * as types from '../constants/actionTypes';
import { browserHistory } from 'react-router';

export const selectTab = tab => dispatch => {
    dispatch({
        type: types.SELECT_TAB,
        tab
    });
    browserHistory.push(`/portfolio/${tab}`);
};

export const selectDisplayCurrency = displayCurrency => ({
    type: types.SELECT_DISPLAY_CURRENCY,
    displayCurrency,
});