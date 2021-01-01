import React from 'react'

import  './SideNavEntry.css'

const SideNavEntry = (props) => {
    return (
        <div
            className={`SideNavEntry ${props.active ? 'Active' : ''}`}
            onClick={props.onClick}
        >
            <div className='SideNavEntry__icon'>
                {props.icon}
            </div>
            <div className='SideNavEntry__label'>
                {props.label}
            </div>
        </div>
    )
}

export default SideNavEntry