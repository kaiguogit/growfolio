import initialState from './initial-state';
import * as types from '../constants/actionTypes';

const tscs = (state = initialState.tscs, action) => {
    let newState = {};

    switch (action.type) {
        case types.REQUEST_TSCS:
            return {
                ...state,
                isFetching: true
            };
        case types.RECEIVE_TSCS:
            return {
                ...state,
                isFetching: false,
                items: action.tscs,
                lastUpdated: action.receivedAt
            };
        case types.ADD_TSCS:
            return {
                ...state,
                isFetching: false,
                items: [
                    ...(state.items),
                    action.tsc
                ],
                lastUpdated: action.receivedAt
            };
        case types.DELETE_TSCS:
            newState.isFetching = false;
            newState.lastUpdated = action.receivedAt;
            newState.items = state.items.filter((x) => x._id !== action.id);
            return newState;
        case types.OPEN_TSCS_FORM:
            return {
                ...state,
                formOpened: true
            };
        case types.CLOSE_TSCS_FORM:
            return {
                ...state,
                formOpened: false
            };
        default:
            return state;
    }
};

export default tscs;