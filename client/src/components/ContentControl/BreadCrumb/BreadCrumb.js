import React from 'react'
import { connect } from 'react-redux'

import { FaChevronRight } from 'react-icons/fa'
import * as actions from '../../../store/actions/index'

import './BreadCrumb.css'

const BreadCrumb = (props) => {

    const breadCrumb = []
    props.data.forEach((entry) => {
        breadCrumb.push(
            <div 
                className='BreadCrumb__entry'
                onClick={() => props.navigateToEntity({
                    name: entry.name,
                    id: entry.id
                })}
            >
                {entry.name}
            </div>
        )
        breadCrumb.push(
            <div className='BreadCrumb__rightIcon'>
                <FaChevronRight/>
            </div>
        )
    })
    breadCrumb.pop()

    return (
        <div className='BreadCrumb'>
            {breadCrumb}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        data: state.content.breadCrumb
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        navigateToEntity: ({ name, id }) => dispatch(actions.openEntity({ name, id }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BreadCrumb)