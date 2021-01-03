import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom'
import './App.css';

import CMSMain from './screens/CMSMain/CMSMain'
import Auth from './screens/Auth/Auth'

import api from './axios'
import * as actions from './store/actions/index'


const App = (props) => {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  useEffect(() => {
    if (token) {
      props.setUser({ username, token })
    }
    else {
      props.unsetUser()
    }
  }, [])


  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    // Loading all metadata needed for CMS functioning.
    // TODO: Move to a separate function?
    props.loadMeta()
    
  }
  else {
    api.defaults.headers.common['Authorization'] = null
  }

  return (
    <div className='App'>
      
      <Route
        path='/'
        render={() => !!props.isAuthenticated ? <CMSMain/> : <Redirect to='/login'/>}
      />

      <Route
        path='/login'
        exact
        render={() => !!props.isAuthenticated ? <Redirect to='/content' /> : <Auth/>}
      />

    </div>   
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: ({username, token}) => dispatch(actions.setUserInfo({username, token})),
    unsetUser: () => dispatch(actions.unsetUserInfo()),
    loadMeta: () => dispatch(actions.loadMeta())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)