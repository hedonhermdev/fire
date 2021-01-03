import * as actionTypes from './actionTypes'
import api from '../../axios'

const loadMetaStart = () => {
    return {
        type: actionTypes.LOAD_META_START
    }
}

const loadMetaSuccess = ({ pageTemplates, pgTemplates }) => {
    return {
        type: actionTypes.LOAD_META_SUCCESS,
        pageTemplates,
        pgTemplates
    }
}

const loadMetaFail = () => {
    return {
        type: actionTypes.LOAD_META_FAIL
    }
}

export const loadMeta = () => {
    return (dispatch) => {
        dispatch(loadMetaStart())
        
        const pageTemplates = api.get('/template/page')
        const pgTemplates = api.get('/pageGroup/template')

        Promise.all([pageTemplates, pgTemplates])
            .then((vals) => {
                dispatch(loadMetaSuccess({
                    pageTemplates: vals[0].data,
                    pgTemplates: vals[1]?.data
                }))
            })
            .catch((e) => {
                console.log('major bruh moment', e)
                dispatch(loadMetaFail())
            })
    }
}