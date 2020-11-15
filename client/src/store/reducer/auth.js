import * as auth from '../actions/auth';

const initialState = {
    loggedIn: true,
    token: null
}

const auths = (state = {initialState}, action) => {
    const { type } = action;

    if( type === auth.LOGIN_USER) {
        return {
            ...state,
            loggedIn: true,
            token: action.token
        }
    }

    if( type === auth.LOGOUT_USER) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        return {
            ...state,
            loggedIn: false,
            token: null
        }
    }

    return state;
}

export default auths;