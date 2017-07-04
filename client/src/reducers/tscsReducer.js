import initialState from './initialState';
import types from '../constants/actionTypes';

const tscsReducer = (state = initialState.tscs, action) => {
    switch (action.type) {
        case types.REQUEST_TSCS:
        case types.ADD_TSCS:
        case types.DELETE_TSCS:
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
        case types.TOGGLE_TSCS_DELETE_MODAL:
            return {
                ...state,
                deleteTscModalData: {
                    isOpened: action.showModal,
                    tscId: action.tscId
                }
            };
        case types.TOGGLE_TSCS_ADD_MODAL:
            return {
                ...state,
                addTscModalOpened: action.showModal
            };
        default:
            return state;
    }
};

export default tscsReducer;