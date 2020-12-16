import * as actionTypes from '../actions/actionTypes'

const initialState = {
    breadCrumb: [],
    loading: true,
    error: null
}

const openEntityStart = (state, action) => {
    return {
        ...state,
        loading: true
    }
}

const openEntityFail = (state, action) => {
    return {
        ...state,
        loading: false,
        error: action.error
    }
}

const openEntity = (state, action) => {
    return {
        ...state,
        loading: false
    }
}

const breadCrumbPush = (state, action) => {
    const newBreadCrumb = state.breadCrumb.concat({
        id: action.id,
        name: action.name
    })
    return {
        ...state,
        breadCrumb: newBreadCrumb
    }
}

const setBreadCrumb = (state, action) => {
    const newBreadCrumb = []
    // the every-loop breaks if the function returns false
    state.breadCrumb.every((item) => {
        newBreadCrumb.push(item)
        return item.id !== action.id
    })
    
    return {
        ...state,
        breadCrumb: newBreadCrumb
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.NAV_OPEN_ENTITY_SUCCESS: return openEntity(state, action)
        case actionTypes.NAV_OPEN_ENTITY_START: return openEntityStart(state, action)
        case actionTypes.NAV_OPEN_ENTITY_FAIL: return openEntityFail(state, action)
        case actionTypes.NAV_BREADCRUMB_PUSH: return breadCrumbPush(state, action)
        case actionTypes.NAV_BREADCRUMB_SET: return setBreadCrumb(state, action)
        default: return state
    }
}

export default reducer