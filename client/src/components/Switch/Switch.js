import React, { useState } from 'react'

import './Switch.css'

const Switch = (props) => {
    const {options} = props
    const [index, setIndex] = useState(0)

    function switchVal() {
        if (index + 1 === options.length) {
            setIndex(0)
        }
        else {
            setIndex(index+1)
        }

        props.onChange(options[index])
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