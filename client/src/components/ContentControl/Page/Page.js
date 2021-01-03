import React, { Fragment, useEffect, useState } from 'react'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import DataBlockEditForm from '../DataBlockEditForm/DataBlockEditForm'

import api from '../../../axios'
import * as actions from '../../../store/actions/index'
import './Page.css'
import ControlBar from '../../ControlBar/ControlBar'
import BreadCrumb from '../BreadCrumb/BreadCrumb'

import { generateFormObject, generateFormData } from '../DataBlockEditForm/helpers'

function getFormObject(dataBlock) {
    if (!dataBlock || !dataBlock.data) {
        return null
    }
    if (!dataBlock.template || !dataBlock.template.structure) {
        return null
    }

    return generateFormObject(dataBlock.data, dataBlock.template.structure)
}

const Page = (props) => {
    const { id } = useParams()

    const [state, setState] = useState({
        loading: true,
        page: {
            _id: '',
            active: false,
            name: '',
            url: '',
            dataBlock: null
        },
        formState: null
    })

    useEffect(() => {
        setState({...state, loading: true})
        api.get(`/page/${id}`)
            .then((response) => {
                const page = response.data
                const formState = getFormObject(page.dataBlock)
                setState({
                    ...state,
                    loading: false,
                    page: response.data,
                    formState: formState
                })
                const { parentGroup } = response.data
                const path = parentGroup.path.concat({
                    name: parentGroup.name,
                    _id: parentGroup._id
                })
                props.updateBreadCrumb(path, response.data.name)
            })
            .catch((e) => {
                console.log('What the fuck\n\n\n', e)
                setState({...state, loading: false})
            })
    }, [id])

    function handleSave(formState) {
        const data = generateFormData(formState, state.page.dataBlock.template.structure)
        api.post(`/page/updateData/${state.page._id}`, {data})
            .then((response) => {
                setState(update(state, {
                    page: {
                        dataBlock: {
                            $set: response.data.dataBlock
                        }
                    }
                }))
            })
            .catch((e) => {
                console.log('What the fuck', e)
            })
    }

    function handleFormStateUpdate(newFormState) {
        setState(update(state, {
            formState: {$set: newFormState}
        }))
    }

    let comp = (
        <div>
            Loading...
        </div>
    )

    if (!state.loading) {
        const { page } = state
        comp = (
            <Fragment>
                <DataBlockEditForm
                    formState={state.formState}
                    onUpdate={(formState) => handleFormStateUpdate(formState)}
                    template={state.page.dataBlock.template.structure}
                />
                <div
                    className='Page__saveBtn'
                    onClick={() => handleSave(state.formState)}
                >
                    Save
                </div>
            </Fragment>
            
        )
    }

    return (
        <div className='Page__wrapper'>
            <div className="Page">
                <BreadCrumb/>
                <div className='Page__editForm'>
                    {comp}
                </div>
            </div>

            <ControlBar>
                {/* Bruh */}
            </ControlBar>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        savePageData: ({ id, data }) => dispatch(actions.saveContent({ id, data, type: 'PAGE' })),
        updateBreadCrumb: (path, currentEntityName) => dispatch(actions.updateBreadCrumb(path, currentEntityName))
    }
}

export default connect(null, mapDispatchToProps)(Page)