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

    const pgTemplateOpts = [
        {
            value: null,
            label: 'None'
        }
    ]

    const [state, setState] = useState({
        entityType: entityOpts[0],
        name: '',
        template: pageTemplateOpts[0],
    })
    console.log(state)

    function handleChange(key, value) {
        console.log(value)
        const newState = {...state}
        newState[key] = value

        // Reset the state and change template options if the entityType
        // changes.
        if (key === 'entityType') {
            console.log('entityType change', value)
            if (value.id === 'PAGE') {
                newState.template = pageTemplateOpts[0]
            }
            else {
                newState.template = pgTemplateOpts[0]
            }
            newState.name = ''
        }
        setState(newState)
    }

    const templateOpts = state.entityType.id === 'PAGE' ? pageTemplateOpts : pgTemplateOpts

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
                templateOpts={templateOpts}
                entityType={state.entityType}
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