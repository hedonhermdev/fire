import React from 'react'

import './ControlBar.css'

const ControlBar = (props) => {
    return (
        <div className='ControlBar'>
            {props.children}
        </div>
    )
}

export default ControlBar