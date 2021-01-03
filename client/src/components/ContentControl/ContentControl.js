import React from 'react'
import { Route } from 'react-router-dom'

import BreadCrumb from './BreadCrumb/BreadCrumb'
import Page from './Page/Page'
import PageGroup from './PageGroup/PageGroup'

import './ContentControl.css'
import ControlBar from '../ControlBar/ControlBar'
import CreateEntityControl from './PageGroup/Controls/CreateEntityControl/CreateEntityControl'
import SharedDataControl from './PageGroup/Controls/SharedDataControl/SharedDataControl'

const ContentControl = (props) => {
    return (
        <div className='ContentControl__wrapper'>
            <div className='ContentControl'>
                {/* <BreadCrumb/> */}
                
                <Route
                    path={`/content/pageGroup/:id`}
                    render={() => <PageGroup/>}
                />

                <Route
                    path={`/content/page/:id`}
                    render={() => <Page/>}
                />
            </div>
            {/* <ControlBar>
                <CreateEntityControl/>
                <SharedDataControl/>
            </ControlBar> */}
        </div>
    )
}



export default ContentControl