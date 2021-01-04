import * as actionTypes from './actionTypes'
import api from '../../axios'

const loadMetaStart = () => {
    return {
        type: actionTypes.LOAD_META_START
    }
}

const loadMetaSuccess = ({ pageTemplates, pgTemplates, rootPageGroup }) => {
    return {
        type: actionTypes.LOAD_META_SUCCESS,
        pageTemplates,
        pgTemplates,
        rootPageGroup
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
        const rootPg = api.get('/pageGroup/root')

        Promise.all([pageTemplates, pgTemplates, rootPg])
            .then((vals) => {
                dispatch(loadMetaSuccess({
                    pageTemplates: vals[0].data,
                    pgTemplates: vals[1]?.data,
                    rootPageGroup: vals[2].data
                }))
            })
            .catch((e) => {
                console.log('major bruh moment', e)
                dispatch(loadMetaFail())
            })
    }
}