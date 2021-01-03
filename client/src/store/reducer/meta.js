import update from 'immutability-helper'
import * as actionTypes from '../actions/actionTypes'

const initialState = {
    loading: true,
    error: null,
    pageTemplates: [],
    pgTemplates: []
}

const loadMetaStart = (state, action) => {
    return update(state, {
        loading: {$set: true}
    })
}

const loadMetaFail = (state, action) => {
    return update(state, {
        loading: {$set: false},
        error: {$set: 'major bruh moment'}
    })
}

const loadMetaSuccess = (state, action) => {
    return update(state, {
        pageTemplates: {$set: action.pageTemplates},
        pgTemplates: {$set: action.pgTemplates},
        loading: {$set: false}
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_META_SUCCESS: return loadMetaSuccess(state, action)
        case actionTypes.LOAD_META_START: return loadMetaStart(state, action)
        case actionTypes.LOAD_META_FAIL: return loadMetaFail(state, action)
        default: return state
    }
}

export default reducer