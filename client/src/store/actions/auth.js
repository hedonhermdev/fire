import * as actionTypes from './actionTypes'
import api from '../../axios'

const loginStart = () => {
    return {
        type: actionTypes.LOGIN_START
    }
}

const loginFail = (e) => {
    return {
        type: actionTypes.LOGIN_FAIL,
        error: e
    }
}

export const setUserInfo = ({ username, token }) => {
    return {
        type: actionTypes.SET_USER_INFO,
        username: username,
        token: token
    }
}

export const unsetUserInfo = () => {
    return {
        type: actionTypes.UNSET_USER_INFO
    }
}

export const login = ({ username, password }) => {
    return (dispatch) => {
        dispatch(loginStart())
        api.post('/user/login', { username, password })
            .then((response) => {
                console.log('bruh1')
                const data = response.data
                dispatch(setUserInfo({
                    username: data.user.username,
                    token: data.token
                }))
            })
            .catch((e) => {
                dispatch(loginFail(e))
            })
    }
}