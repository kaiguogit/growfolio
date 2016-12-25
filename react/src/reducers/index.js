// Set up your root reducer here...
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tscs from './tscsReducer';
import { porfoltioTab } from './portfolioReducer';

const rootReducer = combineReducers({
    tscs,
    porfoltioTab,
    routing: routerReducer
});

export default rootReducer;