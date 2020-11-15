import React from 'react';
import { connect } from 'react-redux';
import request from 'request';
import handleResponse from '../../utils/handleResponse';
import * as api from '../../constants/api';
import './Login.css';

class Login extends React.Component {
    state = {
        username: '',
        password: ''
    }

    login = (e) => {
        e.preventDefault();

        if (this.state.username && this.state.password) {
            request({
                method: 'POST',
                url: api.LOGIN,
                headers: {
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    'username': this.state.username,
                    'password': this.state.password
                }),
            }, (error, response, body) => {
                handleResponse(error, response, body, () => {
                    try {
                        body = JSON.parse(body)
                        this.props.changeLoginStatus(body.token);
                        localStorage.setItem('token', body.token);
                        localStorage.setItem('username', this.state.username);
                    } catch (e) {
                        throw new Error(e.message || "");
                    }
                })
            });
        } else {
            alert('Please enter username and password!');
        }
    }

    render() {
        return (
            <div className='LoginForm'>
                <form onSubmit={(e) => {this.login(e)}}>
                    <div className='MainTitle'>CMS Portal | BITS Pilani</div>
                    <img className='Logo' src={require('../../asstets/bits_logo.png')} alt="BITS_Logo" />
                    <input type='text' placeholder='USERNAME' value={this.state.username} onChange={e => this.setState({ username: e.target.value })} />
                    <input type='password' placeholder='PASSWORD' value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                    <input type='submit' value='LOGIN' />
                </form>
            </div>
        )   
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeLoginStatus: (token) => dispatch({ type: 'LOGIN_USER', token })
    };
};

export default connect(null, mapDispatchToProps)(Login);