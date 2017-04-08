import * as types from '../constants/actionTypes';
import { errorHandler } from '../utils';
import Auth from '../services/Auth';
import { browserHistory } from 'react-router';

export const logout = () => ({type: types.USER_LOGOUT});

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
    .catch(errorHandler);
};

export const submitLogin = data => (dispatch, getState) => {
    dispatch(requestLogin());
    return fetch(__HOST_URL__ + "login", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then((data) => {
        if (data.success) {
            // save the token
            Auth.authenticateUser(data.token, data.user);
            // Redirect to previous intended page if applicable
            const location = getState().routing.locationBeforeTransitions;
            if (location.state && location.state.nextPathname) {
                browserHistory.push(location.state.nextPathname);
            } else {
                browserHistory.push('/');
            }
        }
        dispatch(receiveLogin(data));
    })
    .catch(errorHandler);
};