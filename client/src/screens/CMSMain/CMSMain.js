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
    // useEffect(() => {
    //     if (props.token) {
    //         props.loadRootNav()
    //     }
    // }, [props.token])

    console.log(props.rootPageGroup)
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
                    <Fragment>

                        <Route
                            path='/'
                            exact
                            render={() => <Redirect to={`/content/pageGroup/${props.rootPageGroup._id}`}/>}
                        />

                        <Route
                            path='/content'
                            exact
                            render={() => <Redirect to={`/content/pageGroup/${props.rootPageGroup._id}`}/>}
                        />
    
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
                    </Fragment>
                )
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        metaLoading: state.meta.loading,
        rootPageGroup: state.meta.rootPageGroup
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadRootNav: () => dispatch(actions.openRoot())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CMSMain)