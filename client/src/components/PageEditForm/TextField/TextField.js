import React from 'react'
import prettifyLabel from '../../../utils/prettifyLabel'

import "./TextField.css"

const TextField = (props) => {
    return (
        <div className="textfield">
            {prettifyLabel(props.title)}<br/>
            <input
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    )
}

export default TextField