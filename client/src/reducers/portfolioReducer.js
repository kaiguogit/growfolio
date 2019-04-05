import types from '../constants/actionTypes';
import initialState from './initialState';
import {createReducer, setValueFromAction} from './reducerUtils';

const portfolioReducer = createReducer(initialState.portfolio, {
    [types.SELECT_DISPLAY_CURRENCY]: setValueFromAction('displayCurrency'),
    [types.SELECT_DISPLAY_ACCOUNT]: setValueFromAction('displayAccount'),
    [types.SHOW_ZERO_SHARE_HOLDING]: setValueFromAction('showZeroShareHolding'),
    [types.SET_START_DATE]: setValueFromAction('startDate'),
    [types.SET_END_DATE]: setValueFromAction('endDate')
});

export default portfolioReducer;
