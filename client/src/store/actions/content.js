import * as actionTypes from './actionTypes'
import api from '../../axios'

const openEntityStart = () => {
    console.log('openEntityStart')
    return {
        type: actionTypes.NAV_OPEN_ENTITY_START
    }
}

const openEntityFail = (error) => {
    console.log('openEntityFail')
    return {
        type: actionTypes.NAV_OPEN_ENTITY_FAIL,
        error: error
    }
}

export const setContent = ({data, type}) => {
    console.log('setContent')
    return {
        type: actionTypes.SET_CONTENT,
        data: data,
        entityType: type
    }
}

const saveContentStart = (data) => {
    console.log('saveContentStart')
    return {
        type: actionTypes.SAVE_PAGE_CONTENT_START,
        data: data
    }
}


const saveContentFail = () => {
    return {
        type: actionTypes.SAVE_PAGE_CONTENT_FAIL
    }
}

export const addPageGroup = (pageGroup) => {
    return {
        type: actionTypes.ADD_PAGE_GROUP,
        pageGroup
    }
}

export const addPage = (page) => {
    return {
        type: actionTypes.ADD_PAGE,
        page
    }
}

export const saveContent = ({ id, data, type }) => {
    return (dispatch) => {
        dispatch(saveContentStart(data))
        const base = (type === 'PAGE') ? 'page' : 'pageGroup'
        api.post(`/${base}/updateData/${id}`, {data})
            .then((response) => {
                dispatch(setContent({
                    data: response.data,
                    type
                }))
            })
            .catch((e) => {
                console.log(e)
                dispatch(saveContentFail())
            }) 
    }
}

export const openRoot = () => {
    console.log('openRoot')
    return (dispatch) => {
        dispatch(openEntityStart())
        api.get(`/pageGroup/root`)
            .then((response) => {
                dispatch(setContent({
                    data: response.data,
                    type: 'PAGE_GROUP'
                }))
            })
            .catch((e) => {
                console.log(e)
                dispatch(openEntityFail(e))
            })
    }
}

export const openEntity = ({ name, id, type = 'PAGE_GROUP' }) => {
    return (dispatch) => {
        dispatch(openEntityStart())
        const base = (type === 'PAGE') ? 'page' : 'pageGroup'
        api.get(`/${base}/${id}`)
            .then((response) => {
                dispatch(setContent({
                    data: response.data,
                    type
                }))
            })
            .catch((e) => {
                console.log(e)
                dispatch(openEntityFail(e))
            })
    }
}