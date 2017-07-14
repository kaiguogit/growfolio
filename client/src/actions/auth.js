import types from '../constants/actionTypes';
import { log } from '../utils';
import Auth from '../services/Auth';

const requestSignUp = () => ({type: types.REQUEST_SIGNUP});

const receiveSignUp = (data) => ({
    type: types.RECEIVE_SIGNUP,
    ...data
});

const requestLogin = () => ({type: types.REQUEST_LOGIN});

const receiveLogin = (data) => ({
    type: types.RECEIVE_LOGIN,
    ...data
});

export const clearLoginError = () => ({type: types.CLEAR_LOGIN_ERROR});

export const clearSignUpError = () => ({type: types.CLEAR_SIGNUP_ERROR});
/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
});

export const submitSignUp = (data) => dispatch => {
    dispatch(requestSignUp());
    return fetch(__HOST_URL__ + "signup", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => dispatch(receiveSignUp(data)))
    .catch(log.error);
};

/**
 * submit Login
 * @param {object} payLoad - the user object
 * @param {func} cb - callback function after successful login
 */
export const submitLogin = (payLoad, cb) => (dispatch, /*getState*/) => {
    dispatch(requestLogin());
    return fetch(__HOST_URL__ + "login", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payLoad)
    })
    .then(response => response.json())
    .then((data) => {
        if (data.success) {
            // save the token
            Auth.authenticateUser(data.token, data.user);
            cb();
        }
        dispatch(receiveLogin(data));
    })
    .catch(log.error);
};