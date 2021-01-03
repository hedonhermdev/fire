import update from 'immutability-helper'

import * as actionTypes from '../actions/actionTypes'

const initialState = {
    breadCrumb: [],
    currentEntityName: ''
}

function updateBreadCrumb(state, action) {
    console.log(action)
    return update(state, {
        breadCrumb: {$set: action.newBreadCrumb},
        currentEntityName: {$set: action.currentEntityName}
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_NAV_BREADCRUMB: return updateBreadCrumb(state, action)
        default: return state
    }
}

export default reducer