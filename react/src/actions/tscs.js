import * as types from '../constants/actionTypes';
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

const errorHandler = error => {
    console.log(error);
};

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
const BASE_URI = 'http://localhost:8000/api/';

export const fetchTscs = () => dispatch => {
    dispatch(requestTscs());
    return fetch(BASE_URI + 'transactions')
        .then(response => response.json())
        .then(data => dispatch(receiveTscs(data.result)))
        .catch(errorHandler);
};

export const createTscs = (tsc) => dispatch => {
    dispatch(requestTscs());
    return fetch(BASE_URI + "transactions", {
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
    return fetch(BASE_URI + "transactions", {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify({'id': id}),
    })
    .then(response => response.json())
    .then(() => dispatch(deleteTscs(id)))
    .catch(errorHandler);
};