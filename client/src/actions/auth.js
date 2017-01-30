import * as types from '../constants/actionTypes';
import { errorHandler } from '../utils';
import Auth from '../services/Auth';
import { browserHistory } from 'react-router';

const REQUEST_SIGNUP = () => {
    return {
        type: types.REQUEST_SIGNUP
    };
};

const RECEIVE_SIGNUP = (data) => {
    return {
        type: types.RECEIVE_SIGNUP,
        ...data
    };
};

const REQUEST_LOGIN = () => {
    return {
        type: types.REQUEST_LOGIN
    };
};

const RECEIVE_LOGIN = (data) => {
    return {
        type: types.RECEIVE_LOGIN,
        ...data
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
    dispatch(REQUEST_SIGNUP());
    return fetch(__HOST_URL__ + "signup", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => dispatch(RECEIVE_SIGNUP(data)))
    .catch(errorHandler);
};

export const submitLogin = data => (dispatch, getState) => {
    dispatch(REQUEST_LOGIN());
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
        dispatch(RECEIVE_LOGIN(data));
    })
    .catch(errorHandler);
};