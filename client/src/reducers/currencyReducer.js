import types from '../constants/actionTypes';
import initialState from './initialState';
import {createReducer, setKeyValue, mergeObjectFromAction, reduceReducers} from './reducerUtils';

const currencyReducer = createReducer(initialState.currency, {
    [types.REQUEST_CURRENCY]: setKeyValue('isFetching', true),
    [types.REQUEST_CURRENCY_TIMEOUT]: setKeyValue('isFetching', false),
    [types.RECEIVE_CURRENCY]: reduceReducers(mergeObjectFromAction('data'), setKeyValue('isFetching', false))
});

export default currencyReducer;