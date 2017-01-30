// Set up your root reducer here...
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './authReducer';
import balanceReducer from './balanceReducer';
import currencyReducer from './currencyReducer';
import portfolioReducer  from './portfolioReducer';
import quotesReducer from './quotesReducer';
import symbolsReducer from './symbolsReducer';
import tscsReducer from './tscsReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    balance: balanceReducer,
    currency: currencyReducer,
    portfolio: portfolioReducer,
    quotes: quotesReducer,
    routing: routerReducer,
    symbols: symbolsReducer,
    tscs: tscsReducer
});

export default rootReducer;