import React, { useState } from 'react'
import { connect } from 'react-redux'

import Control from '../../../../Control/Control'
import { FaPlus } from 'react-icons/fa'
import NewEntityForm from './NewEntityForm/NewEntityForm'

const entityOpts = [
    {
        label: 'PAGE',
        id: 'PAGE'
    },
    {
        label: 'PAGE GROUP',
        id: 'PAGE_GROUP'
    }    
]

const CreateEntityControl = (props) => {

    // console.log(props.pageTemplates)
    const pageTemplateOpts = props.pageTemplates.map((template) => {
        return {
            value: template._id,
            label: template.name
        }
    })
    const currTemplate = pageTemplateOpts[0]
    console.log(currTemplate)
    // const bruh = {a: 1}

    const [state, setState] = useState({
        entityType: entityOpts[0],
        name: '',
        template: currTemplate,
    })
    console.log(state)

    function handleChange(key, value) {
        console.log(value)
        const newState = {...state}
        newState[key] = value
        setState(newState)
    }

    return (
        <Control
            icon={<FaPlus/>}
            // width='92%'
            // height='95%'
        >
            <NewEntityForm
                name={state.name}
                template={state.template}
                entityOpts={entityOpts}
                templateOpts={pageTemplateOpts}
                onChange={(key, val) => handleChange(key, val)}
            />
        </Control>
    )
}

const mapStateToProps = (state) => {
    return {
        pageTemplates: state.meta.pageTemplates,
        pgTemplates: state.meta.pgTemplates,
        navData: state.content.data
    }
}

export default connect(mapStateToProps)(CreateEntityControl)