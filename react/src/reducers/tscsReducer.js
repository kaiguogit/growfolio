import initialState from './initialState';
import * as types from '../constants/actionTypes';

const tscsReducer = (state = initialState.tscs, action) => {
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
            return {
                ...state,
                isFetching: false,
                lastUpdated: action.receivedAt,
                items: state.items.filter((x) => x._id !== action.id)
            };
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

export default tscsReducer;