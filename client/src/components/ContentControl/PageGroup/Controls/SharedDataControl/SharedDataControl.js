import React, { useState } from 'react'
import { connect } from 'react-redux'

import api from '../../../../../axios'
import { MdLibraryBooks } from 'react-icons/md'
import Control from '../../../../Control/Control'
import PageEditForm from '../../../PageEditForm/PageEditForm'

const SharedDataControl = (props) => {
    const [state, setState] = useState({
        loading: false
    })
    
    let comp = (
        <div>
            This PageGroup has no Shared Data
        </div>
    )

    function handleSave(data) {
        setState({...state, loading: true})
        api.post(`/pageGroup/updateData/${props.pageGroup._id}`, {data})
            .then((response) => {
                console.log('OK SAVED')
                setState({...state, loading: false})
            })
            .catch((e) => {
                console.log('major bruh moment', e)
                setState({...state, loading: false})
            })
    }
    
    if (props.pageGroup.dataBlock && props.pageGroup.dataBlock.template) {
        comp = (
            <PageEditForm
                data={props.pageGroup.dataBlock.data}
                template={props.pageGroup.dataBlock.template.structure}
                onSave={(data) => handleSave(data)}
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

export default connect(mapStateToProps)(SharedDataControl)