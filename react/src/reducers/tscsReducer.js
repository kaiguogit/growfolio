import initialState from './initial-state';
import {REQUEST_TSCS, RECEIVE_TSCS, ADD_TSCS, DELETE_TSCS} from '../actions';

const tscs = (state = initialState.tscs, action) => {
    let newState = {};

    switch (action.type) {
        case REQUEST_TSCS:
            return {
                ...state,
                isFetching: true
            };
        case RECEIVE_TSCS:
            return {
                ...state,
                isFetching: false,
                items: action.tscs,
                lastUpdated: action.receivedAt
            };
        case ADD_TSCS:
            return {
                ...state,
                isFetching: false,
                items: [
                    ...(state.items),
                    action.tsc
                ],
                lastUpdated: action.receivedAt
            };
        case DELETE_TSCS:
            newState.isFetching = false;
            newState.lastUpdated = action.receivedAt;
            newState.items = state.items.filter((x) => x._id !== action.id);
            return newState;
        default:
            return state;
    }
};

export default tscs;