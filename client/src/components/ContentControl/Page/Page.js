import React from 'react'
import { connect } from 'react-redux'

import PageEditForm from '../../PageEditForm/PageEditForm'
import * as actions from '../../../store/actions/index'
import './Page.css'

const Page = (props) => {
    return (
        <div className="Page">
            <PageEditForm
                data={props.data.dataBlock.data}
                template={props.data.dataBlock.template.structure}
                onSave={(data) => props.savePageData({
                    id: props.data._id,
                    data: data
                })}
            />
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        savePageData: ({ id, data }) => dispatch(actions.saveContent({ id, data, type: 'PAGE' }))
    }
}

export default connect(null, mapDispatchToProps)(Page)