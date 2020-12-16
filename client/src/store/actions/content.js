import * as actionTypes from './actionTypes'
import api from '../../axios'

export const saveContentStart = (data) => {
    console.log('saveContentStart')
    return {
        type: actionTypes.SAVE_PAGE_CONTENT_START,
        data: data
    }
}

export const setContent = (data, type) => {
    console.log('setContent')
    return {
        type: actionTypes.SET_CONTENT,
        data: data,
        entityType: type
    }
}

export const saveContentFail = () => {
    return {
        type: actionTypes.SAVE_PAGE_CONTENT_FAIL
    }
}

export const saveContent = ({ id, data, type }) => {
    return (dispatch) => {
        dispatch(saveContentStart(data))
        const base = (type === 'PAGE') ? 'page' : 'pageGroup'
        api.post(`/${base}/updateData/${id}`, {data})
            .then((response) => {
                dispatch(setContent(response.data, type))
            })
            .catch((e) => {
                console.log(e)
                // dispatch()
                dispatch(saveContentFail())
            }) 
    }
}