import React from 'react'
import "./TextField.css"

const TextField = (props) => {
    return (
        <div className="textfield">
            {props.title}<br/>
            <input
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    )
}

export default TextField