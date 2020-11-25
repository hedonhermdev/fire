import React, { useState, useRef } from 'react'
import "./Accordion.css"

const ACCORDION_CLOSED_WIDTH = "60%"
const ACCORDION_OPEN_WIDTH = "80%"

const Accordion = (props) => {
    const [active, setActive] = useState(false)

    const content = useRef(null)

    function toggleAccordion() {
        setActive(!active)
    }

    const activeClass = active ? "active": ""
    const height = active ? `${content.current.scrollHeight}px` : "0px"
    const width = active ? ACCORDION_OPEN_WIDTH : ACCORDION_CLOSED_WIDTH
    console.log(height)

    return (
        <div
            className={`accordion__section`}
            style={{
                display: "flex",
                flexDirection: "column",
                width: width,
                transition: "width 0.2s ease"
            }}
        >
            <div className={`accordion ${activeClass}`} onClick={toggleAccordion}>
                <p className="accordion__title">{props.title}</p>
            </div>
            <div
                ref={content}
                className="accordion_content"
                style = {{
                    maxHeight: height,
                    overflow: "hidden",
                    transition: "max-height 0.2s ease",
                    backgroundColor: "aqua"
                }}
            >
                <div>
                    {props.children}
                </div>
            </div>
        </div>  
    )
}

export default Accordion