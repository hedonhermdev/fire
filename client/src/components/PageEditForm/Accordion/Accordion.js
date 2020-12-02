import React, { useState, useRef } from 'react'
import AnimateHeight from 'react-animate-height'
import { FaGripVertical } from 'react-icons/fa'
import { Draggable } from 'react-beautiful-dnd'
import styled from '@emotion/styled'

import "./Accordion.css"

const ACCORDION_CLOSED_WIDTH = "75%"
const ACCORDION_OPEN_WIDTH = "90%"

// Inline styles do not work well with Draggables
// Doing it like this, though, somehow works. Fuck you too.
const AccordionCard = styled.div({
    marginBottom: "15px"
})

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
    const borderColor = active ? "#ccc" : "transparent"

    if (!props.draggable) {
        return (
            <div
                className={`accordion__section`}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: width,
                    // margin: "15px 0px",
                    transition: "width 0.2s ease"
                }}
            >
                
                <div className={`accordion ${activeClass}`} onClick={toggleAccordion}>
                    <p className="accordion__title">{props.title}</p>
                    <div className={"accordion__control"}>
                        {/* <div {...provided.dragHandleProps}> */}
                            <FaGripVertical/>
                        {/* </div> */}
                    </div>
                </div>
                <div
                    style={{
                        // backgroundColor: "aqua"
                        border: `1px solid ${borderColor}`
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

    console.log("bruh")

    return (
        <Draggable
            key={props.id}
            draggableId={props.id}
            index={props.index}
        >
            {(provided, snapshot) => (
                <AccordionCard
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div
                        className={`accordion__section`}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: width,
                            // marginBottom: "15px",
                            transition: "width 0.2s ease"
                        }}
                    >
                        
                        <div className={`accordion ${activeClass}`} onClick={toggleAccordion}>
                            <p className="accordion__title">{props.title}</p>
                            <div className={"accordion__control"}>
                                <div {...provided.dragHandleProps}>
                                    <FaGripVertical/>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                // backgroundColor: "aqua"
                                border: `1px solid ${borderColor}`
                            }}
                        >
                            <AnimateHeight
                                duration = {200}
                                height = {height}
                                // height={500}
                            >
                                {props.children}
                            </AnimateHeight>
                        </div>
                    </div>  
                </AccordionCard>
            )}
        </Draggable>
    )
}

export default Accordion