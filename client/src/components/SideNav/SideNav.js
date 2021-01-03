import React from 'react'
import {
    MdHome,
    MdWeb,
    MdCollections,
    MdPeople,
    MdContentPaste,
    MdLock,
    MdCloudDone
} from 'react-icons/md'

import SideNavEntry from './SideNavEntry/SideNavEntry'

import './SideNav.css'

const SideNav = (props) => {
    return (
        <div className='SideNav__wrapper'>
            <div className="SideNav">
                <div className='SideNav__title'>
                    ocean.
                </div>
                <div className='SideNav__fastTravel'>
                    <input/>
                </div>
                <div className='SideNav__viewSite'>
                    <div className='SideNav__viewSite__icon'>
                        <MdHome/>
                    </div>
                    <div className='SideNav__viewSite__label'>
                        View Site
                    </div>
                </div>
    
                <div className='SideNav__sectionLabel'>
                    MANAGE
                </div>
    
                <SideNavEntry
                    icon={<MdWeb/>}
                    label='Content'
                    active
                />
    
                <SideNavEntry
                    icon={<MdCollections/>}
                    label='Files'
                />
    
                <SideNavEntry
                    icon={<MdPeople/>}
                    label='Staff'
                />
    
                <div className='SideNav__sectionLabel'>
                    SETTINGS
                </div>
    
                <SideNavEntry
                    icon={<MdContentPaste/>}
                    label='Templates'
                />
    
                <SideNavEntry
                    icon={<MdLock/>}
                    label='Permissions'
                />
    
                <SideNavEntry
                    icon={<MdCloudDone/>}
                    label='Backups'
                />
            </div>
        </div>
    )
}

export default SideNav