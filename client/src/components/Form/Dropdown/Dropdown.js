import React from 'react'
import Select from 'react-select'

import './Dropdown.css'

const Dropdown = (props) => {
    return (
        <div className='Dropdown'>
            <div className='Dropdown__label'>
                {props.label}
            </div>
            <Select
                value={props.value}
                onChange={(val) => props.onChange(val)}
                options={props.options}
            />
        </div>
    )
}

export default Dropdown