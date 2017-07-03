// Set up your root reducer here...
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import balanceReducer from './balanceReducer';
import currencyReducer from './currencyReducer';
import portfolioReducer  from './portfolioReducer';
import quotesReducer from './quotesReducer';
import symbolsReducer from './symbolsReducer';
import tscsReducer from './tscsReducer';
import ActionTypes from '../constants/actionTypes';

const appReducer = combineReducers({
    auth: authReducer,
    balance: balanceReducer,
    currency: currencyReducer,
    portfolio: portfolioReducer,
    quotes: quotesReducer,
    symbols: symbolsReducer,
    tscs: tscsReducer
});

const rootReducer = (state, action) => {
    if (action.type === ActionTypes.USER_LOGOUT) {
        state = undefined;
    }
    return appReducer(state, action);
};

// Dispatch actions in batch to avoid update component too frequently.
// Idea and code from https://github.com/tshelburne/redux-batched-actions
// https://github.com/reactjs/redux/issues/911#issuecomment-149361073
const batchingReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.BATCH:
            return action.payload.reduce(batchingReducer, state);
        default:
            return rootReducer(state, action);
    }
};

export default batchingReducer;
