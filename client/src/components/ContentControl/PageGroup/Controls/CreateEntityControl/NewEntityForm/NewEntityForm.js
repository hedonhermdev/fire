import React, { useState } from 'react'
import { connect } from 'react-redux'

import CharField from '../../../../../Form/CharField/CharField'
import Dropdown from '../../../../../Form/Dropdown/Dropdown'
import Switch from '../../../../../Switch/Switch'

import './NewEntityForm.css'


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
                {getBaseUrl(props.currentPageGroup, props.name)}
            </div>
            <div
                className='NewEntityForm__submitBtn'
                onClick={props.onSubmit}
            >
                Create
            </div>
        </div>
    )
}



const mapStateToProps = (state) => {
    return {
        pageTemplates: state.meta.pageTemplates,
        pgTemplates: state.meta.pgTemplates,
        pageGroup: state.content.pageGroup
    }
}

export default connect(mapStateToProps)(NewEntityForm)