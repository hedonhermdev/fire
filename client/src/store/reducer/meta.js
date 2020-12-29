import update from 'immutability-helper'
import * as actionTypes from '../actions/actionTypes'

const initialState = {
    pageTemplates: [],
    pgTemplates: []
}

const loadMeta = (state, action) => {
    console.log(action)
    return update(state, {
        pageTemplates: {$set: action.pageTemplates},
        pgTemplates: {$set: action.pgTemplates}
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_META: return loadMeta(state, action)
        default: return state
    }
}

export default reducer