import React, { Fragment, useEffect, useState } from 'react'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { FaFolder, FaFileAlt } from 'react-icons/fa'

import api from '../../../axios'
import * as actions from '../../../store/actions/index'

import './PageGroup.css'
import ControlBar from '../../ControlBar/ControlBar'
import CreateEntityControl from './Controls/CreateEntityControl/CreateEntityControl'
import SharedDataControl from './Controls/SharedDataControl/SharedDataControl'
import BreadCrumb from '../BreadCrumb/BreadCrumb'

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
    const { id } = useParams()

    const [state, setState] = useState({
        loading: true,
        pageGroup: {
            pageGroups: [],
            pages: [],
            _id: '',
            name: '',
            baseUrl: '',
            dataBlock: null
        }
    })

    useEffect(() => {
        setState({...state, loading: true})
        api.get(`/pageGroup/${id}`)
            .then((response) => {
                setState({
                    ...state,
                    loading: false,
                    pageGroup: response.data
                })
                props.updateBreadCrumb(response.data.path, response.data.name)
            })
            .catch((e) => {
                console.log('What the fuck', e)
                setState({...state, loading: false})
            })
    }, [id])

    function handleAddPage(page) {
        setState(update(state, {
            pageGroup: {
                pages: {
                    $push: [{
                        name: page.name,
                        _id: page._id
                    }]
                }
            }
        }))
    }

    function handleAddPageGroup(pageGroup) {
        setState(update(state, {
            pageGroup: {
                pageGroups: {
                    $push: [{
                        name: pageGroup.name,
                        _id: pageGroup._id
                    }]
                }
            }
        }))
    }
    
    let comp = (
        <div>
            Loading...
        </div>
    )

    if (!state.loading) {
        const { pageGroups, pages } = state.pageGroup
        comp = (
            <Fragment>
                <div class='PageGroup__sectionLabel'>
                    PAGE GROUPS
                </div>
                <div className="PageGroup__section">
                    {
                        pageGroups.map((pageGroup) => (
                            <Link
                                to={`/content/pageGroup/${pageGroup._id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <EntityIcon
                                    type='PAGE_GROUP'
                                    label={pageGroup.name}
                                />
                            </Link>
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
                            <Link
                                to={`/content/page/${page._id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <EntityIcon
                                    type='PAGE'
                                    label={page.name}
                                />
                            </Link>
                        ))
                    }
                </div>
            </Fragment>
        )
    }
    
    return (
        <div className='PageGroup__wrapper'>
            <div className="PageGroup">
                <BreadCrumb/>
                {comp}
            </div>
            
            <ControlBar>
                <CreateEntityControl
                    currentPageGroup={state.pageGroup}
                    addPage={handleAddPage}
                    addPageGroup={handleAddPageGroup}
                />
                <SharedDataControl/>
            </ControlBar>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateBreadCrumb: (path, currentEntityName) => dispatch(actions.updateBreadCrumb(path, currentEntityName))
    }
}

export default connect(null, mapDispatchToProps)(PageGroup)