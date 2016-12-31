// Set up your root reducer here...
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tscsReducer from './tscsReducer';
import quotesReducer from './quotesReducer';
import currencyReducer from './currencyReducer';
import symbolsReducer from './symbolsReducer';
import portfolioReducer  from './portfolioReducer';

const rootReducer = combineReducers({
    tscs: tscsReducer,
    portfolio: portfolioReducer,
    quotes: quotesReducer,
    currency: currencyReducer,
    symbols: symbolsReducer,
    routing: routerReducer
});

export default rootReducer;