import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import api from '../../../../../axios'
import * as actions from '../../../../../store/actions/index'

import { MdLibraryBooks } from 'react-icons/md'
import Control from '../../../../Control/Control'
import DataBlockEditForm from '../../../DataBlockEditForm/DataBlockEditForm'

import { generateFormData, generateFormObject } from '../../../DataBlockEditForm/helpers'

function getFormObject(dataBlock) {
    if (!dataBlock || !dataBlock.data) {
        return null
    }
    if (!dataBlock.template || !dataBlock.template.structure) {
        return null
    }

    return generateFormObject(dataBlock.data, dataBlock.template.structure)
}

const SharedDataControl = (props) => {
    const [state, setState] = useState({
        loading: false,
        formState: getFormObject(props.pageGroup.dataBlock)
    })

    console.log('STATE IS', state)

    let comp = (
        <div>
            This PageGroup has no Shared Data
        </div>
    )

    useEffect(() => {
        console.log('in useEffect')
    }, [props.pageGroup])

    function handleSave(data) {
        setState({...state, loading: true})
        api.post(`/pageGroup/updateData/${props.pageGroup._id}`, {data})
            .then((response) => {
                console.log('OK SAVED')
                props.setContent(data)
                setState({...state, loading: false})
            })
            .catch((e) => {
                console.log('major bruh moment', e)
                setState({...state, loading: false})
            })
    }

    function handleUpdate(formState) {
        return {...state, formState: formState}
    }
    
    if (props.pageGroup.dataBlock && props.pageGroup.dataBlock.template) {
        comp = (
            <DataBlockEditForm
                formState={state.formState}
                onUpdate={(formState) => handleUpdate(formState)}
                data={props.pageGroup.dataBlock.data}
                template={props.pageGroup.dataBlock.template.structure}
                onSave={(data) => handleSave(data)}
                loading={state.loading}
            />
        )
    }

    if (state.loading) {
        comp = (
            <div>
                Loading...
            </div>
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