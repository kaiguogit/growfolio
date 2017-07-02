import types from '../constants/actionTypes';
import { errorHandler, getHeaders } from '../utils';

export const updateBalancePercentage = holding => ({
    type: types.UPDATE_BALANCE_PERCENTAGE,
    symbol: holding.symbol,
    percentage: +holding.percentage
});

export const updateBalanceLabel = holding => ({
    type: types.UPDATE_BALANCE_LABEL,
    symbol: holding.symbol,
    label: holding.label
});


const requestAllocations = () => ({
    type: types.REQUEST_ALLOCATIONS
});

const receiveAllocations = (data) => {
    // process allocation to ensure all allocation has symbol
    data = data.filter(allocation => allocation.symbol);
    return {
        type: types.RECEIVE_ALLOCATIONS,
        allocations: data,
        receivedAt: Date.now()
    };
};

const addAllocations = (allocation) => ({
    type: types.ADD_ALLOCATIONS,
    allocation,
    receivedAt: Date.now()
});

const deleteAllocations = (id) => ({
    type: types.DELETE_ALLOCATIONS,
    id: id,
    receivedAt: Date.now()
});

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */

// __MY_API__ is set in webpack globals
export const fetchAllocations = () => dispatch => {
    dispatch(requestAllocations());
    return fetch(__MY_API__ + 'allocations', {
        headers: getHeaders()
    })
    .then(response => response.json())
    .then(data => dispatch(receiveAllocations(data.result)))
    .catch(errorHandler);
};

export const createAllocations = (allocations) => dispatch => {
    dispatch(requestAllocations());
    let allocationsArray = [];
    allocationsArray = Object.keys(allocations).map(key => allocations[key]);
    return fetch(__MY_API__ + "allocations", {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(allocationsArray)
    })
    .then(response => response.json())
    .then(data => dispatch(addAllocations(data.result)))
    .catch(errorHandler);
};

export const removeAllocations = (id) => dispatch => {
    dispatch(requestAllocations());
    return fetch(__MY_API__ + "allocations", {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({'id': id}),
    })
    .then(response => response.json())
    .then(() => dispatch(deleteAllocations(id)))
    .catch(errorHandler);
};