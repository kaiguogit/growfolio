import types from '../constants/actionTypes';
import { log, getHeaders, avoidNaN } from '../utils';

/*
 * Actions
 */
export const requestTscs = () => ({
    type: types.REQUEST_TSCS
});
export const receiveTscs = (data) => ({
    type: types.RECEIVE_TSCS,
    tscs: data,
    receivedAt: Date.now()
});
export const addTscs = () => ({
    type: types.ADD_TSCS
});
export const editTscAction = () => ({
    type: types.EDIT_TSCS
});

export const deleteTscs = () => ({
    type: types.DELETE_TSCS,
    receivedAt: Date.now()
});

export const toggleTscsDeleteModal = (showModal, tsc) => ({
    type: types.TOGGLE_TSCS_DELETE_MODAL,
    showModal,
    tsc
});

export const toggleTscsModal = (showModal, tsc) => ({
    type: types.TOGGLE_TSCS_MODAL,
    showModal,
    tsc
});

// Fake API version
// export const fetchTscs = () => dispatch => {
//     dispatch(requestTscs());
//     return api.getTransactionList()
//         .then(data => dispatch(receiveTscs(data)));
// };

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 * Usage:
 * import { connect } from 'react-redux';
 * import { bindActionCreators } from 'redux';
 * import * as tscsActions from '../actions/tscs';
 * const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(tscsActions, dispatch)
    };
};
 */

export const fetchTscs = () => dispatch => {
    dispatch(requestTscs());
    return fetch(__MY_API__ + 'transactions', {
        headers: getHeaders()
    })
    .then(response => response.json())
    .then(data => {
        let tscs = data.result;
        let tscsMap = {};
        if (!Array.isArray(tscs)) {
            return Promise.reject();
        }
        // Sort tscs by symbol then by date.
        tscs.sort(function(a, b) {
            const symbolA = a.symbol.toUpperCase();
            const symbolB = b.symbol.toUpperCase();
            const result = (symbolA < symbolB) ? -1 : (symbolA > symbolB) ? 1 : 0;
            if (result !== 0) {
                return result;
            }
            return new Date(a.date) - new Date(b.date);
        });
        tscs.forEach(function(tsc) {
            // process tsc for consistency.
            let symbol = tsc.symbol;
            tsc.symbol = symbol.toUpperCase();
            tsc.type = tsc.type.toLowerCase();
            avoidNaN(['shares', 'amount', 'commission'], tsc);
            tscsMap[symbol] = tscsMap[symbol] || [];
            tscsMap[symbol].push(tsc);
        });
        return tscsMap;
    })
    .then(data => dispatch(receiveTscs(data)))
    .catch(log.error);
};

export const createTsc = (tsc) => dispatch => {
    dispatch(addTscs());
    return fetch(__MY_API__ + "transactions", {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(tsc)
    })
    .then(response => response.json())
    // TODO add logic to check result is successful or not
    .then(() => fetchTscs()(dispatch))
    .catch(log.error);
};

export const editTsc = (tsc) => dispatch => {
    dispatch(editTscAction());
    return fetch(__MY_API__ + "transactions", {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(tsc)
    })
    .then(response => response.json())
    // TODO add logic to check result is successful or not
    .then(() => fetchTscs()(dispatch))
    .catch(log.error);
};

export const removeTscs = (tsc) => dispatch => {
    dispatch(deleteTscs());
    return fetch(__MY_API__ + 'transactions', {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({'id': tsc._id}),
    })
    .then(response => response.json())
    // TODO add logic to check result is successful or not
    .then(() => fetchTscs()(dispatch))
    .catch(log.error);
};