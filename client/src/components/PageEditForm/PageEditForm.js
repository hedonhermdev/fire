import React, { Component } from 'react'

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

const PageEditForm = (props) => {
    const { data, template } = props
    const formData = generateFormObject(data, template)

    return <ContentBlockForm formData={formData}/>
}

const ContentBlockForm = (props) => {
    const { formData, path } = props
    console.log(formData)

    const form = []
    Object.entries(formData).forEach(([key, val]) => {
        if (typeof val !== 'string' && !Array.isArray(val)) {
            const field = (
                <div>
                    {key}<br></br>
                    <input
                        onChange = {(e) => console.log(e.target.value)}
                        value = {val._value}
                    />
                </div>
            )
            form.push(field)
        }
        else if (Array.isArray(val)) {
            val.forEach((formVal) => {
                const field = (
                    <ContentBlockForm
                        formData = {formVal}
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