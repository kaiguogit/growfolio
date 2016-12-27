// Set up your root reducer here...
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tscsReducer from './tscsReducer';
import quotesReducer from './quotesReducer';
import { portfolioTab } from './portfolioReducer';

const rootReducer = combineReducers({
    tscs: tscsReducer,
    portfolioTab,
    quotes: quotesReducer,
    routing: routerReducer
});

export default rootReducer;