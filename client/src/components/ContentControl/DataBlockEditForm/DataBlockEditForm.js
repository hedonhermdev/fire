import _ from 'lodash'
import React, { useState } from 'react'
import update from 'immutability-helper'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import { FaPlus } from 'react-icons/fa'
import Accordion from './Accordion/Accordion'
import TextField from './TextField/TextField'
import RichTextField from './RichTextField/RichTextField'
import Label from './Label/Label'

import {
    createNewDataObject,
    editorStateToHtml,
    generateFormData,
    generateFormObject,
    generateUpdateFromPath,
    htmlToEditorState,
    reorder
} from './helpers'

import "./DataBlockEditForm.css"


const DataBlockEditForm = (props) => {
    const { data, template, loading } = props
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
                loading={loading}
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
                width: "60%",
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

    let saveButton = (
        <div
            className="FormSaveButton"
            onClick={props.onSave}
        >
            Save
        </div>
    )
    if (props.loading) {
        saveButton = (
            <div
                className='FormSaveButton'
            >
                Loading...
            </div>
        )
    }

    const backgroundColor = props.root ? 'var(--background-color)' : 'var(--entity-color)'
    const content = (
        <div style={{backgroundColor: backgroundColor}}>
            <div
                style={{
                    padding: "15px"
                }}>

                {form}
                
            </div>
            {
                props.root
                ?   saveButton
                :   null
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

export default DataBlockEditForm
