import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { MdFontDownload, MdSettings } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa'

import SideNav from '../../components/SideNav/SideNav'
import ContentControl from '../../components/ContentControl/ContentControl'

import * as actions from '../../store/actions/index'

import './CMSMain.css'
import ControlBar from '../../components/ControlBar/ControlBar'


const CMSMain = (props) => {
    // Load the root PageGroup for the user
    useEffect(() => {
        if (props.token) {
            props.loadRootNav()
        }
    }, [props.token])

    let controls = []
    const addControl = (
        <div className='CMSMain__ControlBtn'>
            <FaPlus/>
        </div>
    )
    const settingsControl = (
        <div className='CMSMain__ControlBtn'>
            <MdSettings/>
        </div>
    )
    controls.push(addControl)
    controls.push(settingsControl)

    console.log('bruhhhhh')
    return (
        <div className='CMSMain'>
            <SideNav/>
            <div className="MainArea">
                <ContentControl/>
            </div>
            <ControlBar>
                {controls}
            </ControlBar>
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