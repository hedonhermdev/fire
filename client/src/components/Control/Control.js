import React, { Fragment, useState } from 'react'
import { FaTimes } from 'react-icons/fa'

import './Control.css'

const Control = (props) => {

    const [open, setOpen] = useState(false)
    const {
        width = '300px',
        height = '400px'
    } = props

    const styles = {
        position: 'absolute',
        top: '0px',
        right: '100px',
        width: width,
        height: height,
        marginTop: '20px',
        backgroundColor: 'var(--entity-color)',
        boxShadow: 'var(--heavy-shadow)',
        borderRadius: 'var(--border-radius-l)',
        padding: '15px',
        boxSizing: 'border-box'
    }

    // Apparently setting the display property is faster than
    // loading and removing the component from the DOM. More
    // importantly, this is done to keep the children mounted
    // in the DOM so that they don't lose their state even
    // when the Control is closed
    if (!open) {
        styles.display = 'none'
    }

    return (
        <div className='Control'>
            <div
                className={`Control__icon ${open ? 'open': ''}`}
                onClick={() => setOpen(!open)}
            >
                {
                    open
                    ?   <FaTimes/>
                    :   props.icon
                }
            </div>
            
            {/* The Modal */}
            <div style={styles}>
                {props.children}
            </div>

            
        </div>
    )
}

export default Control