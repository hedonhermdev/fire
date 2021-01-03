import React, { useEffect, useState } from 'react'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import DataBlockEditForm from '../DataBlockEditForm/DataBlockEditForm'

import api from '../../../axios'
import * as actions from '../../../store/actions/index'
import './Page.css'
import ControlBar from '../../ControlBar/ControlBar'
import BreadCrumb from '../BreadCrumb/BreadCrumb'

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
        }
    })

    useEffect(() => {
        setState({...state, loading: true})
        api.get(`/page/${id}`)
            .then((response) => {
                setState({
                    ...state,
                    loading: false,
                    page: response.data
                })
                console.log('PATH', response.data)
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

    function handleSave(data) {
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

    let comp = (
        <div>
            Loading...
        </div>
    )

    if (!state.loading) {
        const { page } = state
        comp = (
                <DataBlockEditForm
                    data={page.dataBlock.data}
                    template={page.dataBlock.template.structure}
                    onSave={handleSave}
                />
            
        )
    }

    return (
        <div className='Page__wrapper'>
            <div className="Page">
                <BreadCrumb/>
                {comp}
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