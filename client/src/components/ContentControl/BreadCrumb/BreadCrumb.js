import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { FaChevronRight } from 'react-icons/fa'
import * as actions from '../../../store/actions/index'

import './BreadCrumb.css'

const BreadCrumb = (props) => {

    const breadCrumb = []

    props.breadCrumbData.forEach((entry) => {
        breadCrumb.push(
            <Link
                to={`/content/pageGroup/${entry._id}`}
                style={{ textDecoration: 'none' }}
            >
                <div className='BreadCrumb__entry'>
                    {entry.name === '__main' ? 'Home' : entry.name}
                </div>
            </Link>
        )
        breadCrumb.push(
            <div className='BreadCrumb__rightIcon'>
                /
            </div>
        )
    })
    
    breadCrumb.push((
        <div className='BreadCrumb__entry BreadCrumb__entry__highlighted'>
            {props.currentEntityName === '__main' ? 'Home' : props.currentEntityName}
        </div>
    ))

    return (
        <div className='BreadCrumb'>
            {breadCrumb}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        data: state.content.breadCrumb,
        breadCrumbData: state.nav.breadCrumb,
        currentEntityName: state.nav.currentEntityName
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        navigateToEntity: ({ name, id }) => dispatch(actions.openEntity({ name, id }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BreadCrumb)