import * as types from '../constants/actionTypes';
import { errorHandler } from '../utils';
/*
 * Actions
 */
export const requestTscs = () => ({
    type: types.REQUEST_TSCS
});
export const receiveTscs = (data) => {
    // process tsc for consistency.
    data.forEach(tsc=> {
        tsc.symbol = tsc.symbol.toUpperCase();
        tsc.type = tsc.type.toLowerCase();
    });
    return {
        type: types.RECEIVE_TSCS,
        tscs: data,
        receivedAt: Date.now()
    };
};
export const addTscs = (tsc) => ({
    type: types.ADD_TSCS,
    tsc: tsc,
    receivedAt: Date.now()
});
export const deleteTscs = (id) => ({
    type: types.DELETE_TSCS,
    id: id,
    receivedAt: Date.now()
});
export const openTscsForm = () => ({
    type: types.OPEN_TSCS_FORM
});
export const closeTscsForm = () => ({
    type: types.CLOSE_TSCS_FORM
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
 */
const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
});

export const fetchTscs = () => dispatch => {
    dispatch(requestTscs());
    return fetch(__MY_API__ + 'transactions')
        .then(response => response.json())
        .then(data => dispatch(receiveTscs(data.result)))
        .catch(errorHandler);
};

export const createTscs = (tsc) => dispatch => {
    dispatch(requestTscs());
    return fetch(__MY_API__ + "transactions", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(tsc)
    })
    .then(response => response.json())
    .then(data => dispatch(addTscs(data.result)))
    .catch(errorHandler);
};

export const removeTscs = (id) => dispatch => {
    dispatch(requestTscs());
    return fetch(__MY_API__ + "transactions", {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify({'id': id}),
    })
    .then(response => response.json())
    .then(() => dispatch(deleteTscs(id)))
    .catch(errorHandler);
};