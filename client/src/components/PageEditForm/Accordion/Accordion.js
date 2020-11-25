import React, { useState, useRef } from 'react'
import AnimateHeight from 'react-animate-height';

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
    const height = active ? `auto` : "0"
    // const height = active ? `${content.current.scrollHeight}px` : "0px"
    // const height = active ? `100%` : "0px"
    const width = active ? ACCORDION_OPEN_WIDTH : ACCORDION_CLOSED_WIDTH
    console.log(height)

    return (
        <div
            className={`accordion__section`}
            style={{
                display: "flex",
                flexDirection: "column",
                width: width,
                margin: "15px",
                transition: "width 0.2s ease"
            }}
        >
            <div className={`accordion ${activeClass}`} onClick={toggleAccordion}>
                <p className="accordion__title">{props.title}</p>
            </div>
            {/* <div
                ref={content}
                className="accordion_content"
                style = {{
                    maxHeight: height,
                    height: "auto",
                    overflow: "hidden",
                    transition: "max-height 0.9s ease",
                    backgroundColor: "#efefef",
                    border: "1px solid #ccc"
                }}
            >
                <div>
                    {props.children}
                </div>
            </div> */}
            <div
                style={{
                    backgroundColor: "aqua"
                }}
            >
                <AnimateHeight
                    duration = {200}
                    height = {height}
                >
                    {props.children}
                </AnimateHeight>
            </div>
        </div>  
    )
}

export default Accordion