import React from 'react'
import { NavLink } from 'react-router-dom'
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

                <NavLink
                    className='SideNav__viewSite'
                    to='/site'
                    activeClassName='Selected'
                >
                    <div className='SideNav__viewSite__icon'>
                        <MdHome/>
                    </div>
                    <div className='SideNav__viewSite__label'>
                        View Site
                    </div>
                </NavLink>
    
                <div className='SideNav__sectionLabel'>
                    MANAGE
                </div>
    
                <SideNavEntry
                    icon={<MdWeb/>}
                    label='Content'
                    link='/content'
                    active
                />
    
                <SideNavEntry
                    icon={<MdCollections/>}
                    label='Files'
                    link='/files'
                />
    
                <SideNavEntry
                    icon={<MdPeople/>}
                    label='Staff'
                    link='/staff'
                />
    
                <div className='SideNav__sectionLabel'>
                    SETTINGS
                </div>
    
                <SideNavEntry
                    icon={<MdContentPaste/>}
                    label='Templates'
                    link='/templates'
                />
    
                <SideNavEntry
                    icon={<MdLock/>}
                    label='Permissions'
                    link='/permissions'
                />
    
                <SideNavEntry
                    icon={<MdCloudDone/>}
                    label='Backups'
                    link='/backups'
                />
            </div>
        </div>
    )
}

export default SideNav