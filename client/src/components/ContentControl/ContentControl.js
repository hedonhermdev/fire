import React from 'react'
import { connect } from 'react-redux'

import BreadCrumb from './BreadCrumb/BreadCrumb'
import Page from './Page/Page'
import PageGroup from './PageGroup/PageGroup'

import './ContentControl.css'
import ControlBar from '../ControlBar/ControlBar'
import CreateEntityControl from './PageGroup/Controls/CreateEntityControl/CreateEntityControl'
import SharedDataControl from './PageGroup/Controls/SharedDataControl/SharedDataControl'

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
                ? <PageGroup data={props.pageGroup}/>
                : <Page data={props.page}/>
        )
    }

    return (
        <div className='ContentControl__wrapper'>
            <div className='ContentControl'>
                <BreadCrumb/>
                {content}
            </div>
            <ControlBar>
                <CreateEntityControl/>
                <SharedDataControl/>
            </ControlBar>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        entityType: state.content.entityType,
        loading: state.content.loading,
        pageGroup: state.content.pageGroup,
        page: state.content.page
    }
}

export default connect(mapStateToProps)(ContentControl)