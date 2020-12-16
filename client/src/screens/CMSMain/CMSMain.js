import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import SideNav from '../../components/SideNav/SideNav'
import ContentControl from '../../components/ContentControl/ContentControl'

import * as actions from '../../store/actions/index'

import './CMSMain.css'

const CMSMain = (props) => {
    // Load the root PageGroup for the user
    useEffect(() => {
        console.log('yoooo')
        props.loadRootNav()
    }, [])

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

const mapDispatchToProps = (dispatch) => {
    return {
        loadRootNav: () => dispatch(actions.openRoot())
    }
}

export default connect(null, mapDispatchToProps)(CMSMain)