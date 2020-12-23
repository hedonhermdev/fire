import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import SideNav from '../../components/SideNav/SideNav'
import ContentControl from '../../components/ContentControl/ContentControl'

import * as actions from '../../store/actions/index'

import './CMSMain.css'

const CMSMain = (props) => {
    // Load the root PageGroup for the user
    useEffect(() => {
        if (props.token) {
            props.loadRootNav()
        }
    }, [props.token])

    console.log('bruhhhhh')
    return (
        <div className='CMSMain'>
            <SideNav/>
            <div className="MainArea">
                <ContentControl/>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadRootNav: () => dispatch(actions.openRoot())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CMSMain)