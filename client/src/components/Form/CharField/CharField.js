import React, { useState } from 'react'

import './CharField.css'

const CharField = (props) => {

    const [active, setActive] = useState(false)
    const fieldClass = `CharField__input ${active ? 'selected' : ''}`

    return (
        <div className='CharField'>
            <div className='CharField__label'>
                {props.label}
            </div>
            <div className={fieldClass}>
                <input
                    value={props.value}
                    onChange={(e) => props.onChange(e)}
                    onFocus={() => setActive(true)}
                    onBlur={() => setActive(false)}
                />
            </div>
        </div>
    )
}

export default CharField