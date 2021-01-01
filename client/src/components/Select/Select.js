import { first } from 'lodash'
import React, { useEffect, useState } from 'react'

import './Select.css'

const Option = (props) => {
    return (
        <div
            className='Select__option'
            onClick={props.onClick}
        >
            {props.label}
        </div>
    )
}

const Select = (props) => {
    const { value, options } = props

    const [open, setOpen] = useState(true)

    function handleClickOutside(event) {
        const c = event.target.classList
        if (!c.contains('Select') &&
            !c.contains('Select__option')) {
                setOpen(false)
            }
    }

    function handleSelect(value) {
        props.onChange(value)
        setOpen(false)
    }

    function toggle() {
        setOpen(!open)
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    })

    const selectOpts = []
    const firstOpt = (
        <Option
            label={value.label}
            onClick={() => handleSelect(value)}
        />
    )
    selectOpts.push(firstOpt)

    options.forEach((option) => {
        if (option.id !== value.id) {
            selectOpts.push(
                <div
                    className='Select__option'
                    onClick={() => handleSelect(option)}
                >
                    {option.label}
                </div>
            )
        }
    })

    return (
        <div
            className={`Select ${open ? 'open' : ''}`}
            onClick={toggle}
        >
            {
                open
                ?   selectOpts
                :   value.label
            }
        </div>
    )
}

export default Select