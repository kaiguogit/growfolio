// Set up your root reducer here...
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tscsReducer from './tscsReducer';
import quotesReducer from './quotesReducer';
import currencyReducer from './currencyReducer';
import symbolsReducer from './symbolsReducer';
import balanceReducer from './balanceReducer';
import portfolioReducer  from './portfolioReducer';

const rootReducer = combineReducers({
    tscs: tscsReducer,
    portfolio: portfolioReducer,
    quotes: quotesReducer,
    currency: currencyReducer,
    symbols: symbolsReducer,
    balance: balanceReducer,
    routing: routerReducer
});

export default rootReducer;