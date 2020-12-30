import React, { useState } from 'react'
import { connect } from 'react-redux'

import CharField from '../../../../../Form/CharField/CharField'
import Dropdown from '../../../../../Form/Dropdown/Dropdown'
import Switch from '../../../../../Switch/Switch'

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

    return (
        <div className='NewEntityForm'>
            <div className='NewEntityForm__title'>
                Add
                <div className='NewEntityForm__switch'>
                    <Switch
                        options={props.entityOpts}
                        onChange={(val) => props.onChange('entityType', val)}
                    />
                </div>
            </div>
            <CharField
                label='NAME'
                value={props.name}
                onChange={(e) => props.onChange('name', e.target.value)}
            />
            <Dropdown
                label='TEMPLATE'
                value={props.template}
                onChange={(val) => props.onChange('template', val)}
                options={props.templateOpts}
            />
            <div className='NewEntityForm__url__label'>
                BASE URL
            </div>
            <div className='NewEntityForm__url__value'>
                {getBaseUrl(props.navData, props.name)}
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