import * as types from '../constants/actionTypes';
import initialState from './initialState';



const authReducer = (state=initialState.auth, action) => {
    switch(action.type) {
        case types.REQUEST_SIGNUP:
            return {
                ...state,
                signup: {
                    ...state.signup,
                    isFetching: true
                }
            };
        case types.RECEIVE_SIGNUP:
            return {
                ...state,
                signup: {
                    ...state.signup,
                    isFetching: false,
                    message: action.message,
                    success: action.success,
                    user: action.user
                }
            };
        case types.REQUEST_LOGIN:
            return {
                ...state,
                login: {
                    ...state.login,
                    isFetching: true
                }
            };
        case types.RECEIVE_LOGIN:
            return {
                ...state,
                login: {
                    ...state.login,
                    isFetching: false,
                    message: action.message,
                    success: action.success,
                    user: action.user
                }
            };
        default:
            return state;
    }
};
export default authReducer;
