// Set up your root reducer here...
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tscs from './tscsReducer';

const rootReducer = combineReducers({
    tscs,
    routing: routerReducer
});

export default rootReducer;