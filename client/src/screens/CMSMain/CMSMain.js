import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Route, Redirect } from 'react-router-dom'

import SideNav from '../../components/SideNav/SideNav'
import ContentControl from '../../components/ContentControl/ContentControl'

import * as actions from '../../store/actions/index'

import './CMSMain.css'



const CMSMain = (props) => {
    const location = useLocation()
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

                :   (
                    <Route
                        path={`/content`}
                        render={() => (
                            <div className="MainArea">
                                <div className='MainArea__contentWrapper'>
                                    <ContentControl/>
                                </div>
                            </div>
                        )}
                    />
                )
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