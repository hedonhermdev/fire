import React, { useState, createContext } from 'react'
import update from 'immutability-helper'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import _, { create } from 'lodash'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'

import { FaPlus } from 'react-icons/fa'

import Accordion from './Accordion/Accordion'
import TextField from './TextField/TextField'
import RichTextField from './RichTextField/RichTextField'
import Label from './Label/Label'

import "./PageEditForm.css"

function htmlToEditorState(html) {
    const { contentBlocks, entityMap} = htmlToDraft(html)
    return EditorState.createWithContent(
        ContentState.createFromBlockArray(
            contentBlocks, entityMap
        )
    )
}

function editorStateToHtml(editorState) {
    return draftToHtml(
        convertToRaw(
            editorState.getCurrentContent()
        )
    )
}

function generateFormObject(formData, formStructure) {
    const form = formData
    const newForm = {}
    let meta = formStructure._meta
    if (!meta) {
        meta = {
            quantity: 1
        }
    }

    newForm._accordionTitle = meta.title ? formData[meta.title] : "DataBlock"

    Object.keys(formData).forEach((key) => {
        if (key === '_meta' || key == '_accordionTitle') {
            return
        }
        
        // const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

        const val = formData[key]
        
        if (typeof val === 'string') {
            let valueType
            if (typeof formStructure[key] === 'string') {
                valueType = formStructure[key]
            }
            else {
                valueType = formStructure[key].contentType
            }

            let value = val
            if (valueType === 'richtext') {
                value = htmlToEditorState(value)
            }

            const newVal = {
                _value: value,
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
    if (!formStructure._meta) {
        formStructure._meta = {
            quantity: 1
        }
    }
    
    Object.entries(formObject).forEach(([key, val]) => {
        if (key === '_accordionTitle') {
            return
        }

        // Checking like this because we wanna allow empty strings
        if (val._value !== undefined && val._value !== null) {
            let value = val._value
            if (val._type === 'richtext') {
                value = editorStateToHtml(value)
                console.log('value is', value)
            }
            formData[key] = value
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

function createNewDataObject(template) {
    const result = {}
    if (!template._meta) {
        template._meta = {
            quantity: 1
        }
    }

    Object.entries(template).forEach(([key, val]) => {
        if (key === '_meta') {
            return
        }

        if (typeof val === "string") {
            let value = "bruh"
            if (val === 'richtext') {
                value = htmlToEditorState(value)
            }
            result[key] = {
                _type: val,
                _value: value
            }
            return
        }
        else if (typeof val === 'object' && val.contentType) {
            let value = 'bruh'
            if (val.contentType === 'richtext') {
                value = htmlToEditorState(value)
            }
            result[key] = {
                _type: val.contentType,
                _value: value
            }
        }
        else {
            const quantity = val._meta.quantity
            let iterations = 1
            if (typeof quantity === 'number' && quantity !== -1) {
                iterations = quantity
            }
            else {
                if (quantity.min) {
                    iterations = quantity.min
                }
            }
            const newSubData = []
            for (let i = 0; i < iterations; i++) {
                newSubData.push(createNewDataObject(val))
            }
            result[key] = newSubData
        }
    })

    result._accordionTitle = template._meta.title ? result[template._meta.title]._value : "DataBlock"

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

    console.log(formState)

    return (
            <ContentBlockForm
                formData={formState}
                template={template}
                path={''}
                onUpdate={updateFormData}
                onSave={() => {props.onSave(generateFormData(formState, template))}}
                index={props.index}
                level={0}
                root
            />
    )
}




const ContentBlockFormList = (props) => {
    const { formDataList, path, title, level, template } = props
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

    function onAdd() {
        const newDataObject = createNewDataObject(template)
        const newFormDataList = formDataList.concat(newDataObject)
        const updateObj = generateUpdateFromPath(path, newFormDataList)
        props.onUpdate(updateObj)
    }

    function onDelete(index) {
        const newFormDataList = [...formDataList]
        newFormDataList.splice(index, 1)
        const updateObj = generateUpdateFromPath(path, newFormDataList)
        props.onUpdate(updateObj)
    }

    let marginTop = "30px"
    if (level === 0) {
        marginTop = "50px"
    }

    // Deciding whether or not we should allow adding more objects
    // or deleting any objects, based on quantity constraints in the
    // template
    let showAdd = false
    let deleteable = false 

    const { quantity } = template._meta
    if (typeof quantity === 'number') {
        if (quantity === -1) {
            showAdd = true
            deleteable = true
        }
        else {
            showAdd = (formDataList.length < quantity)
            deleteable = (formDataList.length > quantity)
        }
    }
    else if (typeof quantity === 'object') {
        const { max, min } = quantity
        showAdd = (!max) || (max && formDataList.length < max)
        deleteable = (!min) || (min && formDataList.length > min)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{
                marginBottom: "15px",
                marginTop: marginTop,
                // backgroundColor: "green",
                width: "75%",
                display: "flex",
                justifyContent: "space-between"
                // flexDirection: "column"
            }}>
                <Label value={title} level={level} bold/>
                {showAdd 
                ? <div
                    className="AccordionAddBtn"
                    onClick={onAdd}
                >
                    <FaPlus/>
                </div>
                : null}
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
                                    level={level+1}
                                    formData={formData}
                                    template={template}
                                    path={nextPath}
                                    onUpdate={props.onUpdate}
                                    onDelete={onDelete}
                                    deleteable={deleteable}
                                    index={index}
                                    id={index}
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
    const { formData, path, level, template, deleteable } = props

    const form = []

    const onFieldChange = (value, key, isRichText=false) => {
        const updatePath = path === '' ? `${key}._value` : `${path}.${key}._value`
        const updateObj = generateUpdateFromPath(updatePath, value)
        props.onUpdate(updateObj)
    } 

    Object.entries(formData).forEach(([key, val]) => {
        if (typeof val !== 'string' && !Array.isArray(val)) {
            let inputField = (
                <TextField
                    level={level}
                    title={key}
                    value = {val._value}
                    onChange = {(e) => onFieldChange(e.target.value, key)}
                />
            )
            if (val._type === 'richtext') {
                inputField = (
                    <RichTextField
                        level={level}
                        title={key}
                        value={val._value}
                        onChange={(editorState) => onFieldChange(editorState, key)}
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
            const nextTemplate = template[key]
            const nextPath = (path === '') ? key : `${path}.${key}`
            const field = (
                <ContentBlockFormList
                    level={level}
                    formDataList={val}
                    template={nextTemplate}
                    path={nextPath}
                    title={key}
                    onUpdate={props.onUpdate}
                />
            )
            form.push(field)
        }
    })

    const content = (
        <div style={{backgroundColor: "#fff"}}>
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
            {
                deleteable
                ?   <div
                        className="AccordionDeleteButton"
                        onClick={() => props.onDelete(props.index)}
                    >
                        Delete
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