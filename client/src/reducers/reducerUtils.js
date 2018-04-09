import merge from 'lodash/merge';
import reduceReducers from 'reduce-reducers';
// Reference for splitting reducer logic into slice reducer, case reducer
// https://redux.js.org/recipes/structuring-reducers/refactoring-reducers-example#combining-reducers-by-slice

export {reduceReducers};

export const createReducer = (initialState, handlers) => {
    return (state = initialState, action) => {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        }
        return state;
    };
};

export const mergeObject = (oldObj, newObj) => {
    return merge({}, oldObj, newObj);
};

export const updateItemInArray = (array, itemId, updateItemCallback) => {
    const updatedItems = array.map(item => {
        if (item.id !== itemId) {
            // Since we only want to update one item, preserve all others as they are now
            return item;
        }

        // Use the provided callback to create an updated item
        const updatedItem = updateItemCallback(item);
        return updatedItem;
    });

    return updatedItems;
};

/**
 * Set state key with same key from action.
 * @param {string} key key name to use.
 */
export const setValueFromAction = key => (state, action) => {
    return action[key] != undefined ? {
        ...state,
        [key]: action[key]
    } : state;
};

/**
 * Merge object with same key from action.
 * @param {string} key key name to use.
 */
export const mergeObjectFromAction = key => (state, action) => {
    const result = action[key] != undefined ? {
        ...state,
        [key]: mergeObject(state[key], action[key])
    } : state;
    return result;
};

/**
 * Set state key with value, ignore action.
 * @param {string} key key name to use.
 * @param {string} value key name to use.
 */
export const setKeyValue = (key, value) => (state) => {
    return {
        ...state,
        [key]: value
    };
};
