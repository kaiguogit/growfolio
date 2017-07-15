import initialState from './initialState';
import types from '../constants/actionTypes';

const tscsReducer = (state = initialState.tscs, action) => {
    switch (action.type) {
        case types.REQUEST_TSCS:
        case types.ADD_TSCS:
        case types.EDIT_TSCS:
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
                    isOpened: !!action.showModal,
                    tsc: action.tsc ? Object.assign({}, action.tsc) : null
                }
            };
        case types.TOGGLE_TSCS_MODAL:
            return {
                ...state,
                dialogModal: {
                    isOpened: !!action.showModal,
                    tsc: action.tsc ? Object.assign({}, action.tsc) : null
                }
            };
        default:
            return state;
    }
};

export default tscsReducer;