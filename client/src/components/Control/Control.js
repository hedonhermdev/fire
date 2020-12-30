import React, { Fragment, useState } from 'react'
import { FaTimes } from 'react-icons/fa'

import './Control.css'

const Control = (props) => {

    const [open, setOpen] = useState(true)
    const {
        width = '300px',
        height = '400px'
    } = props

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
            {
                open
                ?   <div style={{
                        // float: 'right',
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
                    }}>
                        {props.children}
                    </div>
                :   null
            }
            
        </div>
    )
}

export default Control