import * as actionTypes from '../actions/actionTypes'

const initialState = {
    loading: false,
    error: null,
    user: null,
    token: '',
    isAuthenticated: true
}

const setUser = (state, action) => {
    localStorage.setItem('token', action.token)
    localStorage.setItem('username', action.username)

    console.log(action)
    console.log('bruh')

    return {
        ...state,
        loading: false,
        error: null,
        user: action.user,
        token: action.token,
        isAuthenticated: true
    }
}

const unsetUser = (state, action) => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')

    return {
        ...state,
        user: null,
        token: '',
        loading: false,
        isAuthenticated: false
    }
}

const loginStart = (state, action) => {
    console.log('loginstart')
    return {
        ...state,
        loading: true
    }
}

const loginFail = (state, action) => {
    return {
        ...state,
        loading: false,
        error: action.error
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_START: return loginStart(state, action)
        case actionTypes.SET_USER_INFO: return setUser(state, action)
        case actionTypes.UNSET_USER_INFO: return unsetUser(state, action)
        case actionTypes.LOGIN_FAIL: return loginFail(state, action)
        default: return state
    }
}

export default reducer