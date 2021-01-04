import React from 'react'
import { NavLink } from 'react-router-dom'

import  './SideNavEntry.css'

const SideNavEntry = (props) => {
    return (
        <NavLink
            className={`SideNavEntry`}
            onClick={props.onClick}
            to={props.link}
            activeClassName='Selected'
        >
            <div className='SideNavEntry__icon'>
                {props.icon}
            </div>
            <div className='SideNavEntry__label'>
                {props.label}
            </div>
        </NavLink>
    )
}

export default SideNavEntry