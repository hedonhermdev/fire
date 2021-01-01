import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

import * as actions from '../../store/actions/index'

import './Auth.css'

const Auth = (props) => {

    const [state, setState] = useState({
        username: '',
        password: ''
    })

    function updateValue(key, value) {
        const newState = {...state}
        newState[key] = value
        setState(newState)
    }

    return (
        <div className='Auth'>
            <div className='Auth__formContainer'>

                <div className='Auth__title'>
                    Log in.
                </div>

                <div className='Auth__field'>
                    <div className='Auth__inputLabel'>
                        Username
                    </div>
                    <div className='Auth__inputField'>
                        <input
                            onChange={(e) => updateValue('username', e.target.value)}
                            value={state.username}
                        />
                    </div>
                </div>

                <div className='Auth__field'>
                    <div className='Auth__inputLabel'>
                        Password
                    </div>
                    <div className='Auth__inputField'>
                        <input
                            type='password'
                            onChange={(e) => updateValue('password', e.target.value)}
                            value={state.password}
                        />
                    </div>
                </div>

                <div 
                    className='Auth__submitBtn'
                    onClick={() => props.login({
                        username: state.username,
                        password: state.password
                    })}
                >
                    Continue
                </div>

            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: ({ username, password }) => dispatch(actions.login({ username, password }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)