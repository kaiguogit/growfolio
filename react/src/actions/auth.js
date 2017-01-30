import * as types from '../constants/actionTypes';
import { errorHandler } from '../utils';
import Auth from '../services/Auth';

const SUBMIT_SIGNUP = () => {
    return {
        type: types.SUBMIT_SIGNUP
    };
};

const SUBMIT_SIGNUP_RESPONDED = (data) => {
    return {
        type: types.SUBMIT_SIGNUP_RESPONDED,
        data
    };
};

const SUBMIT_LOGIN = () => {
    return {
        type: types.SUBMIT_LOGIN
    };
};

const SUBMIT_LOGIN_RESPONDED = (data) => {
    return {
        type: types.SUBMIT_SIGNUP_RESPONDED,
        data
    };
};

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
});

export const submitSignUp = (data) => dispatch => {
    dispatch(SUBMIT_SIGNUP());
    return fetch(__HOST_URL__ + "signup", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => dispatch(SUBMIT_SIGNUP_RESPONDED(data.result)))
    .catch(errorHandler);
};

export const submitLogin = (data) => dispatch => {
    dispatch(SUBMIT_LOGIN());
    return fetch(__HOST_URL__ + "login", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then((data) => {
        if (data.success) {
            // save the token
            Auth.authenticateUser(data.token);
        }
        dispatch(SUBMIT_LOGIN_RESPONDED(data.result));
    })
    .catch(errorHandler);
};