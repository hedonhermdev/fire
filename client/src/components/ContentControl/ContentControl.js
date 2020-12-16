import React from 'react'
import { connect } from 'react-redux'

import BreadCrumb from './BreadCrumb/BreadCrumb'
import Page from './Page/Page'
import PageGroup from './PageGroup/PageGroup'

import './ContentControl.css'

const ContentControl = (props) => {
    // console.log(props.navData)
    console.log('bruh', props.bruh)

    let content = (
        <div>
            
        </div>
    )

    if (!props.loading) {
        content = (
            props.entityType === 'PAGE_GROUP' 
                ? <PageGroup data={props.navData}/>
                : <Page/>
        )
    }

    return (
        <div className='ContentControl'>
            <BreadCrumb />
            {content}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        navData: state.nav.data,
        entityType: state.nav.entityType,
        loading: state.nav.loading,
        bruh: state
    }
}

export default connect(mapStateToProps)(ContentControl)