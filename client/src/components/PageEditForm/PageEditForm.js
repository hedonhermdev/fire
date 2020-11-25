import React, { useState, createContext } from 'react'
import update from 'immutability-helper'
import _, { create } from 'lodash'

const generateFormObject = (formData, formStructure) => {
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

const generateUpdateFromPath = (path, updateVal) => {
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

// const path = 'info.name.first'
// const val = 'dushyant'
// const obj = generateUpdateFromPath(path, val)
// console.log(JSON.stringify(obj))


const PageEditForm = (props) => {
    const { data, template } = props
    const formData = generateFormObject(data, template)

    const [formState, setFormState] = useState(formData)

    const updateFormData = (updateObj) => {
        const newFormState = update(formState, updateObj)
        setFormState(newFormState)
    }

    return <ContentBlockForm
                formData={formState}
                path={''}
                onUpdate={updateFormData}
            />
}

const ContentBlockForm = (props) => {
    const { formData, path } = props

    const form = []

    const onFieldChange = (e, key) => {
        const updatePath = path === '' ? `${key}._value` : `${path}.${key}._value`
        const updateObj = generateUpdateFromPath(updatePath, e.target.value)
        props.onUpdate(updateObj)
    } 

    Object.entries(formData).forEach(([key, val]) => {
        if (typeof val !== 'string' && !Array.isArray(val)) {
            const field = (
                <div>
                    {key}<br></br>
                    <input
                        onChange = {(e) => onFieldChange(e, key)}
                        value = {val._value}
                    />
                </div>
            )
            form.push(field)
        }
        else if (Array.isArray(val)) {
            val.forEach((formVal, index) => {
                const nextPath = (path === '') ? `${key}.${index}` : `${path}.${key}.${index}`
                const field = (
                    <ContentBlockForm
                        formData = {formVal}
                        path = {nextPath}
                        onUpdate = {props.onUpdate}
                    />
                )
                form.push(field)
            })
        }
    })

    return (
        <div
            style={{
                border: "1px solid black",
                margin: "15px",
                padding: "15px"
            }}>
            <strong>{formData._accordionTitle}</strong>
            {form}
        </div>
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
// console.log(JSON.stringify(testData))