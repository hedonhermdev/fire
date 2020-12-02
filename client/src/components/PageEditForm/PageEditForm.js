import React, { useState, createContext } from 'react'
import update from 'immutability-helper'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import _, { create } from 'lodash'

import Accordion from './Accordion/Accordion'
import TextField from './TextField/TextField'
import RichTextField from './RichTextField/RichTextField'

import "./PageEditForm.css"

function generateFormObject(formData, formStructure) {
    const form = formData
    const newForm = {}
    const meta = formStructure._meta

    newForm._accordionTitle = formData[meta.title]

    Object.keys(formData).forEach((key) => {
        if (key === '_meta' || key == '_accordionTitle') {
            return
        }
        
        const val = formData[key]
        
        if (typeof val === 'string') {
            let valueType
            if (typeof formStructure[key] === 'string') {
                valueType = formStructure[key]
            }
            else {
                valueType = formStructure[key].contentType
            }

            const newVal = {
                _value: val,
                _type: valueType
            }

            newForm[key] = newVal
        }
        else if (typeof val === 'object') {
            if (!Array.isArray(val)) {
                val = [val]
            }

            const newVal = []
            val.forEach((formVal) => (
                newVal.push(generateFormObject(formVal, formStructure[key]))
            ))
            newForm[key] = newVal
        }
    })

    return newForm
}

function generateFormData(formObject, formStructure) {
    const formData = {}
    Object.entries(formObject).forEach(([key, val]) => {
        if (key === '_accordionTitle') {
            return
        }

        if (val._value) {
            formData[key] = val._value
        }
        else {
            if (formStructure[key]._meta.quantity === 1
                || formStructure[key]._meta.quantity === undefined) {
                    formData[key] = generateFormData(val[0], formStructure[key])
            }
            else {
                const vals = []
                val.forEach((v) => vals.push(generateFormData(v, formStructure[key])))
                formData[key] = vals
            }
        }
    })

    return formData
}

function generateUpdateFromPath(path, updateVal) {
    const keys = path.split('.')
    const updateObj = {}
    let curr = updateObj

    keys.forEach((key) => {
        curr[key] = {}
        curr = curr[key]
    })
    
    curr["$set"] = updateVal
    return updateObj
}

function reorder(list, startIndex, endIndex) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}




const PageEditForm = (props) => {
    const { data, template } = props
    const formData = generateFormObject(data, template)

    const [formState, setFormState] = useState(formData)

    const updateFormData = (updateObj) => {
        const newFormState = update(formState, updateObj)
        setFormState(newFormState)
    }

    return (
            <ContentBlockForm
                formData={formState}
                path={''}
                onUpdate={updateFormData}
                onSave={() => {console.log(generateFormData(formState, template))}}
                index={props.index}
                root
            />
    )
}

const ContentBlockFormList = (props) => {
    const { formDataList, path, title } = props
    const form = [...formDataList]

    if (!Array.isArray(formDataList)) {
        console.log("What the fuck?")
        return
    }

    function onDragEnd(result) {
        if (!result.destination) {
            return
        }

        if (result.destination.index === result.source.index) {
            return
        }

        const newFormDataList = reorder(
            formDataList,
            result.source.index,
            result.destination.index
        )
        const updateObj = generateUpdateFromPath(path, newFormDataList)
        props.onUpdate(updateObj)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{
                marginBottom: "15px"
            }}>
                {title}
            </div>
            <Droppable droppableId="list">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {formDataList.map((formData, index) => {
                            const nextPath = (path === '') ? `${index}` : `${path}.${index}`
                            return (
                                <ContentBlockForm
                                    formData={formData}
                                    path={nextPath}
                                    onUpdate={props.onUpdate}
                                    index={index}
                                />
                            )
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )

}

const ContentBlockForm = (props) => {
    const { formData, path } = props

    const form = []

    const onFieldChange = (value, key) => {
        const updatePath = path === '' ? `${key}._value` : `${path}.${key}._value`
        const updateObj = generateUpdateFromPath(updatePath, value)
        props.onUpdate(updateObj)
    } 

    Object.entries(formData).forEach(([key, val]) => {
        if (typeof val !== 'string' && !Array.isArray(val)) {
            let inputField = (
                <TextField
                    title={key}
                    value = {val._value}
                    onChange = {(e) => onFieldChange(e.target.value, key)}
                />
            )
            if (val._type === 'richtext') {
                inputField = (
                    <RichTextField
                        title={key}
                        value={val._value}
                        onChange={(text) => onFieldChange(text, key)}
                    />
                )
            }
            const field = (
                <div>
                    {inputField}
                </div>
            )
            
            form.push(field)
        }
        else if (Array.isArray(val)) {
            const nextPath = (path === '') ? key : `${path}.${key}`
            const field = (
                <ContentBlockFormList
                    formDataList={val}
                    path={nextPath}
                    title={key}
                    onUpdate={props.onUpdate}
                />
            )
            form.push(field)
        }
    })

    const content = (
        <div>
            <div
                style={{
                    padding: "15px"
                }}>

                {form}
                
            </div>
            {
            props.root
            ?   <div
                    className="FormSaveButton"
                    onClick={props.onSave}
                >
                    Save
                </div>
            : null
            }
        </div>
    )

    if (props.root) {
        return content
    }

    return (
        <Accordion
            title={formData._accordionTitle}
            id={props.index.toString()}
            index={props.index}
            draggable={!props.root}
        >
            {content}
        </Accordion>
    )
}

export default PageEditForm


// const template = {
//     _meta: {
//         quantity: -1,
//         title: "button_title"
//     },
//     button_title: "text",
//     content_title: "text",
//     content: "richtext",
//     additional: {
//         _meta: {
//             quantity: 2,
//             title: "interest"
//         },
//         interest: "text",
//         papers: "text"
//     }
// }

// const data = {
//     button_title: "Academics",
//     content_title: "Academics Content",
//     content: "These are my academic interests - I have no academic interests",
//     additional: [
//         {
//             interest: "SDN",
//             papers: "5"
//         },
//         {
//             interest: "AI/ML",
//             papers: "0"
//         }
//     ]
// }

// const testData = generateFormObject(data, template)
// console.log(testData)
// const original = generateFormData(testData, template)
// console.log(original)
// console.log(JSON.stringify(testData))


// const path = 'info.name.first'
// const val = 'dushyant'
// const obj = generateUpdateFromPath(path, val)
// console.log(JSON.stringify(obj))