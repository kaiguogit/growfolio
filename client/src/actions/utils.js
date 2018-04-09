import { getHeaders } from '../utils';

// makeActionCreator
// https://redux.js.org/recipes/reducing-boilerplate#generating-action-creators
/**
 * Generate action creator that save all its arguments into keys provided in same order.
 * e.g
 * const addComment = makeActionCreator('ADD_COMMENT', 'user', 'text')
 * addComment('john', 'I like it');
 * // output:
 * {
 *  type: 'ADD_COMMENT',
 *  user: 'john',
 *  text: 'I like it'
 * }
 * @param {string} type Action type
 * @param {string} argNames key names that will be used as key in action object.
 */
export const makeActionCreator = (type, ...argNames) => {
    return (...args) => {
        let action = { type };
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index];
        });
        return action;
    };
};

export const callAPI = (url) => {
    return fetch(url, {headers: getHeaders()})
    .then(response => response.json())
    .then(response => {
        if (!response.success) {
            return Promise.reject(response);
        }
        return response;
    })
    .then((data) => data.result);
};