// Fake API version
// import WebAPI from '../services/web-api';
// const api = new WebAPI();

import * as types from '../constants/actionTypes';

const BASE_URI = 'http://localhost:8000/api/';

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
export const selectTab = (tab) => ({
    type: types.SELECT_TAB,
    tab
});
/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
const errorHandler = error => {
    console.log(error);
};

// Fake API version
// export const fetchTscs = () => dispatch => {
//     dispatch(requestTscs());
//     return api.getTransactionList()
//         .then(data => dispatch(receiveTscs(data)));
// };

const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
});

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
