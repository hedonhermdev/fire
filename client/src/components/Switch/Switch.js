import React, { useState } from 'react'

import './Switch.css'

const Switch = (props) => {
    const {options} = props
    const [index, setIndex] = useState(0)

    function switchVal() {
        let newIndex
        if (index + 1 === options.length) {
            newIndex = 0
        }
        else {
            newIndex = index+1
        }

        props.onChange(options[newIndex])
        setIndex(newIndex)
    }
    
    return (
        <div
            className='Switch'
            onClick={switchVal}
        >
            {options[index].label}
        </div>
    )
}

export default Switch