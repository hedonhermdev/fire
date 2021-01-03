import _ from 'lodash'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'

import "./PageEditForm.css"

export function htmlToEditorState(html) {
    const { contentBlocks, entityMap} = htmlToDraft(html)
    return EditorState.createWithContent(
        ContentState.createFromBlockArray(
            contentBlocks, entityMap
        )
    )
}

export function editorStateToHtml(editorState) {
    return draftToHtml(
        convertToRaw(
            editorState.getCurrentContent()
        )
    )
}

export function generateFormObject(formData, formStructure) {
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

        let val = formData[key]
        
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

export function generateFormData(formObject, formStructure) {
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

export function generateUpdateFromPath(path, updateVal) {
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

export function reorder(list, startIndex, endIndex) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

export function createNewDataObject(template) {
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