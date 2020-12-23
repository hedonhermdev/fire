import * as actionTypes from './actionTypes'
import * as actions from './index'
import api from '../../axios'

export const navBreadCrumbPush = (name, id) => {
    return {
        type: actionTypes.NAV_BREADCRUMB_PUSH,
        name: name,
        id: id
    }
}

const openEntityStart = () => {
    console.log('openEntityStart')
    return {
        type: actionTypes.NAV_OPEN_ENTITY_START
    }
}

const openEntitySuccess = () => {
    console.log('openEntitySuccess')
    return {
        type: actionTypes.NAV_OPEN_ENTITY_SUCCESS
    }
}

const openEntityFail = (error) => {
    console.log('openEntityFail')
    return {
        type: actionTypes.NAV_OPEN_ENTITY_FAIL,
        error: error
    }
}

export const openRoot = () => {
    console.log('openRoot')
    return (dispatch) => {
        dispatch(openEntityStart())
        api.get(`/pageGroup/root`)
            .then((response) => {
                // console.log(response.data)
                let { name, _id } = response.data
                name = (name === '__main') ? 'Home' : name
                dispatch(navBreadCrumbPush(name, response.data._id))
                dispatch(actions.setContent(response.data, 'PAGE_GROUP'))
                dispatch(openEntitySuccess())
            })
            .catch((e) => {
                console.log(e)
                dispatch(openEntityFail(e))
            })
    }
}

export const openEntity = ({ name, id, type, pushToBreadCrumb = true }) => {
    return (dispatch) => {
        dispatch(openEntityStart())
        const base = (type === 'PAGE') ? 'page' : 'pageGroup'
        api.get(`/${base}/${id}`)
            .then((response) => {
                if (pushToBreadCrumb) {
                    dispatch(navBreadCrumbPush(name, id))
                }
                dispatch(actions.setContent(response.data, type))
                dispatch(openEntitySuccess())
            })
            .catch((e) => {
                console.log(e)
                dispatch(openEntityFail(e))
            })
    }
}

const setBackBreadCrumb = ({id}) => {
    return {
        type: actionTypes.NAV_BREADCRUMB_SET,
        id: id
    }
}

export const navigateToEntity = ({ name, id }) => {
    return (dispatch) => {
        dispatch(openEntity({
            name,
            id,
            type: 'PAGE_GROUP',
            pushToBreadCrumb: false
        }))
        dispatch(setBackBreadCrumb({id}))
    }
}