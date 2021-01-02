import React, { useState } from 'react'
import { connect } from 'react-redux'
import api from '../../../../../axios'
import * as actions from '../../../../../store/actions/index'

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
    props.pgTemplates.forEach((pgTemplate) => {
        pgTemplateOpts.push({
            value: pgTemplate._id,
            label: pgTemplate.name
        })
    })

    const [state, setState] = useState({
        entityType: entityOpts[0],
        name: '',
        template: pageTemplateOpts[0],
        loading: false
    })

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

    function handleSubmit() {
        setState({...state, loading: true})
        if (state.entityType.id === 'PAGE') {
            const opts = {
                name: state.name,
                template: state.template.value,
                parentGroup: props.parentGroup._id
            }
            api.post('/page', opts)
                .then((response) => {
                    const page = response.data
                    props.addPage(page)
                    setState({ ...state, loading: false })
                })
                .catch((e) => {
                    console.log(e)
                    setState({ ...state, loading: false })
                })
        }
        else {
            const opts = {
                name: state.name,
                parentGroup: props.parentGroup._id
            }
            if (state.template.value) {
                opts.template = state.template.value
            }
            api.post('/pageGroup', opts)
                .then((response) => {
                    const pg = response.data
                    props.addPageGroup(pg)
                    setState({ ...state, loading: false })
                })
                .catch((e) => {
                    console.log(e)
                    setState({ ...state, loading: false })
                })
        }
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
                onSubmit={handleSubmit}
            />
        </Control>
    )
}

const mapStateToProps = (state) => {
    return {
        pageTemplates: state.meta.pageTemplates,
        pgTemplates: state.meta.pgTemplates,
        parentGroup: state.content.pageGroup
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addPageGroup: (pageGroup) => dispatch(actions.addPageGroup(pageGroup)),
        addPage: (page) => dispatch(actions.addPage(page))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEntityControl)