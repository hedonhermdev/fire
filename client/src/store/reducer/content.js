import { saveContent } from '../actions'
import * as actionTypes from '../actions/actionTypes'

const initialState = {
    breadCrumb: [],
    loading: true,
    error: null,
    entityType: 'PAGE_GROUP',
    data: {}
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

const setContent = (state, action) => {
    console.log('yoooo', action)
    return {
        ...state,
        data: action.data,
        loading: false,
        entityType: action.entityType
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

const saveContentStart = (state, action) => {
    const newDatablock = {
        ...state.data.dataBlock,
        data: action.data
    }
    const newData = {
        ...state.data,
        dataBlock: newDatablock
    }
    return {
        ...state,
        loading: true,
        data: newData
    }
}

const saveContentFail = (state, action) => {
    return {
        ...state,
        loading: false
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.NAV_OPEN_ENTITY_SUCCESS: return openEntity(state, action)
        case actionTypes.NAV_OPEN_ENTITY_START: return openEntityStart(state, action)
        case actionTypes.NAV_OPEN_ENTITY_FAIL: return openEntityFail(state, action)
        case actionTypes.NAV_BREADCRUMB_PUSH: return breadCrumbPush(state, action)
        case actionTypes.NAV_BREADCRUMB_SET: return setBreadCrumb(state, action)
        case actionTypes.SET_CONTENT: return setContent(state, action)
        case actionTypes.SAVE_PAGE_CONTENT_START: return saveContentStart(state, action)
        case actionTypes.SAVE_PAGE_CONTENT_FAIL: return saveContentFail(state, action)
        default: return state
    }
}

export default reducer