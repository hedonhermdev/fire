import React from 'react'
import { connect } from 'react-redux'

import PageEditForm from '../../PageEditForm/PageEditForm'

import './Page.css'

const Page = (props) => {
    return (
        <div className="Page">
            <PageEditForm
                data={props.pageData.dataBlock.data}
                template={props.pageData.dataBlock.template.structure}
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        pageData: state.nav.data
    }
}

export default connect(mapStateToProps)(Page)