import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import api from '../../../../../axios'
import * as actions from '../../../../../store/actions/index'

import { MdLibraryBooks } from 'react-icons/md'
import Control from '../../../../Control/Control'
import DataBlockEditForm from '../../../DataBlockEditForm/DataBlockEditForm'

import { generateFormData, generateFormObject } from '../../../DataBlockEditForm/helpers'

import './SharedDataControl.css'

const SharedDataControl = (props) => {
    const [state, setState] = useState({
        loading: false
    })

    let comp = (
        <div>
            This PageGroup has no Shared Data
        </div>
    )

    useEffect(() => {
        setState({
            ...state,
            formState: props.formState
        })
    }, [props.formState])

    function handleSave(formState) {
        const data = generateFormData(formState, props.template)
        setState({...state, loading: true})
        api.post(`/pageGroup/updateData/${props.currentPageGroup._id}`, {data})
            .then((response) => {
                props.onSave(data)
                setState({...state, loading: false})
            })
            .catch((e) => {
                console.log('major bruh moment', e)
                setState({...state, loading: false})
            })
    }

    function handleUpdate(formState) {
        props.onUpdate(formState)
    }
    
    if (props.formState) {
        comp = (
            <Fragment>
                <DataBlockEditForm
                    formState={props.formState}
                    onUpdate={(formState) => handleUpdate(formState)}
                    // data={props.pageGroup.dataBlock.data}
                    template={props.template}
                />
                <div
                    className='SharedDataControl__saveBtn'
                    onClick={() => handleSave(props.formState)}
                >
                    Save
                </div>
            </Fragment>
        )
    }

    return (
        <Control
            icon={<MdLibraryBooks/>}
            height='95%'
            width='1300px'
        >
            {comp}
        </Control>
    )
}

const mapStateToProps = (state) => {
    return {
        pageGroup: state.content.pageGroup
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setContent: (data) => dispatch(actions.setContent({ data, type: 'PAGE_GROUP' }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SharedDataControl)