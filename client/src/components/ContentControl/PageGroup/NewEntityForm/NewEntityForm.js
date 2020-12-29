import React, { useState } from 'react'
import { connect } from 'react-redux'

import CharField from '../../../Form/CharField/CharField'
import Dropdown from '../../../Form/Dropdown/Dropdown'
import Switch from '../../../Switch/Switch'

import './NewEntityForm.css'

const options = [
    {
        label: 'PAGE',
        id: 'PAGE'
    },
    {
        label: 'PAGE GROUP',
        id: 'PAGE_GROUP'
    }    
]

function getBaseUrl(parentGroup, childName) {
    let parentUrl = ''
    if (parentGroup.name !== '__main') {
        parentUrl = parentGroup.baseUrl
    }

    if (childName === 'index' || childName === '') {
        return parentUrl
    }

    if (parentUrl === '') {
        return childName
    }

    return `${parentUrl}/${childName}`
}


const NewEntityForm = (props) => {
    const pgTemplateOpts = props.pageTemplates.map((template) => {
        return {
            value: template._id,
            label: template.name
        }
    })

    const [state, setState] = useState({
        entityType: options[0],
        name: '',
        template: pgTemplateOpts[0]
    })

    function handleChange(key, value) {
        console.log(value)
        const newState = {...state}
        newState[key] = value
        setState(newState)
    }

    return (
        <div className='NewEntityForm'>
            <div className='NewEntityForm__title'>
                Add
                <div className='NewEntityForm__switch'>
                    <Switch
                        options={options}
                        onChange={(val) => handleChange('entityType', val)}
                    />
                </div>
            </div>
            <CharField
                label='NAME'
                value={state.name}
                onChange={(e) => handleChange('name', e.target.value)}
            />
            <Dropdown
                label='TEMPLATE'
                value={state.template}
                onChange={(val) => handleChange('template', val)}
                options={pgTemplateOpts}
            />
            <div className='NewEntityForm__url__label'>
                BASE URL
            </div>
            <div className='NewEntityForm__url__value'>
                {getBaseUrl(props.navData, state.name)}
            </div>
            <div className='NewEntityForm__submitBtn'>
                Create
            </div>
        </div>
    )
}



const mapStateToProps = (state) => {
    return {
        pageTemplates: state.meta.pageTemplates,
        pgTemplates: state.meta.pgTemplates,
        navData: state.content.data
    }
}

export default connect(mapStateToProps)(NewEntityForm)