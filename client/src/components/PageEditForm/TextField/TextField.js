import React from 'react'
import Label from '../Label/Label'

import "./TextField.css"

const TextField = (props) => {
    return (
        <div className="textfield">
            <Label value={props.title} level={props.level}/>
            {/* <br/> */}
            <input
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    )
}

export default TextField