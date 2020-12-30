import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'

import SideNav from '../../components/SideNav/SideNav'
import ContentControl from '../../components/ContentControl/ContentControl'

import * as actions from '../../store/actions/index'

import './CMSMain.css'
import ControlBar from '../../components/ControlBar/ControlBar'
import CreateEntityControl from '../../components/ContentControl/PageGroup/Controls/CreateEntityControl/CreateEntityControl'


const CMSMain = (props) => {
    // Load the root PageGroup for the user
    useEffect(() => {
        if (props.token) {
            props.loadRootNav()
        }
    }, [props.token])

    return (
        <div className='CMSMain'>
            <SideNav/>
            {
                props.metaLoading
                ?   (
                    <div>
                        Loading
                    </div>
                )

                :   <div className="MainArea">
                        <div className='MainArea__contentWrapper'>
                            <ContentControl/>
                        </div>
                        <ControlBar>
                            <CreateEntityControl/>
                        </ControlBar>
                    </div>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        metaLoading: state.meta.loading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadRootNav: () => dispatch(actions.openRoot())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CMSMain)