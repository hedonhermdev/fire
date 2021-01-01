import React from 'react'
import './Label.css'

const ROOT_LABEL_SIZE = 20

function sizeDownScaleFactor(level) {
    return 1 - level/10
}

const Label = (props) => {
    const { value, level, bold } = props

    const prettyLabel = value.split('_').map((word) => {
        return `${word[0].toUpperCase()}${word.slice(1, word.length)}`
    }).join(' ')

    let size = ROOT_LABEL_SIZE * sizeDownScaleFactor(level)
    
    // We want level-0 section labels to be bigger because they define
    // different "positions" on the page.
    if (bold && level === 0) {
        size = size + 10
    }

    const weight = bold ? "700" : "500"

    return (
        <div
            className="FormLabel"
            style={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: weight,
                fontSize: `${size}px`
            }}
        >
            {prettyLabel}
        </div>
    )
}

export default Label