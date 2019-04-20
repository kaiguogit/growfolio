import initialState from './initialState';
import types from '../constants/actionTypes';
import {setKeyValueFromAction} from './reducerUtils';

const tscsReducer = (state = initialState.tscs, action) => {
    let newHolding = false;
    const newCollapseState = {};
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
            // Init collapse.
            action.tscs.forEach(tsc => {
                if (state.collapse[tsc.symbol] === undefined) {
                    newCollapseState[tsc.symbol] = true;
                    newHolding = true;
                }
            });
            return {
                ...state,
                collapse: newHolding ? Object.assign({}, state.collapse, newCollapseState) :
                    state.collapse,
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
        case types.SET_ALL_COLLAPSE_STATE:
            return {
                ...state,
                collapse: Object.keys(state.collapse).reduce((acc, symbol) => {
                    acc[symbol] = action.value;
                    return acc;
                }, {})
            };
        case types.SET_ONE_COLLAPSE_STATE:
            return {
                ...state,
                collapse: setKeyValueFromAction('symbol', 'value')(state.collapse, action)
            };
        case types.SET_TSC_TYPE_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    type: action.filter
                }
            };
        case types.SET_TSC_GROUPING:
            return {
                ...state,
                grouping: action.grouping
            };
        default:
            return state;
    }
};

export default tscsReducer;