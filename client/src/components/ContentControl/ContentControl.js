import React from 'react'
import { connect } from 'react-redux'

import BreadCrumb from './BreadCrumb/BreadCrumb'
import Page from './Page/Page'
import PageGroup from './PageGroup/PageGroup'

import './ContentControl.css'

const ContentControl = (props) => {
    console.log('ContentControl was re-rendered')
    let content = (
        <div>
            
        </div>
    )
    
    console.log('props.loading is', props.loading)

    if (!props.loading) {
        content = (
            props.entityType === 'PAGE_GROUP' 
                ? <PageGroup data={props.navData}/>
                : <Page data={props.navData}/>
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
        navData: state.content.data,
        entityType: state.content.entityType,
        loading: state.content.loading,
        bruh: state
    }
}

export default connect(mapStateToProps)(ContentControl)