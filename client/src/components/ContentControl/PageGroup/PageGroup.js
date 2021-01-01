import React from 'react'
import { connect } from 'react-redux'
import { FaFolder, FaFileAlt } from 'react-icons/fa'

import Modal from '../../Modal/Modal'
import * as actions from '../../../store/actions/index'

import './PageGroup.css'

const EntityIcon = (props) => {
    let icon = (
        <div className='EntityIcon__icon__page'>
            <FaFileAlt/>
        </div>
    )
    if (props.type === 'PAGE_GROUP') {
        icon = (
            <div className='EntityIcon__icon__pageGroup'>
                <FaFolder/>
            </div>
        )
    }
    return (
        <div
            className='EntityIcon'
            onClick={props.onClick}
        >
            {icon}
            <div className='EntityIcon__label'>
                {props.label}
            </div>
        </div>
    )
}

const PageGroup = (props) => {
    // console.log("bruh", props.data)
    const { pageGroups, pages } = props.data
    return (
        <div className="PageGroup">
            <div class='PageGroup__sectionLabel'>
                PAGE GROUPS
            </div>
            <div className="PageGroup__section">
                {
                    pageGroups.map((pageGroup) => (
                        <EntityIcon
                            type='PAGE_GROUP'
                            label={pageGroup.name}
                            onClick={() => props.openEntity({
                                name: pageGroup.name,
                                id: pageGroup._id,
                                type: 'PAGE_GROUP'
                            })}
                        />
                    ))
                }
            </div>
            <br/>
            <div class='PageGroup__sectionLabel'>
                PAGES
            </div>
            <div className="PageGroup__section">
                {
                    pages.map((page) => (
                        <EntityIcon
                            type='PAGE'
                            label={page.name}
                            onClick={() => props.openEntity({
                                name: page.name,
                                id: page._id,
                                type: 'PAGE'
                            })}
                        />
                    ))
                }
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        openEntity: ({ id, name, type }) => dispatch(actions.openEntity({ name, id, type }))
    }
}

export default connect(null, mapDispatchToProps)(PageGroup)