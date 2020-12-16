import * as actionTypes from '../actions/actionTypes'

const initialState = {
    entityType: 'PAGE_GROUP',
    data: {},
    loading: 'true',
    error: null
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

const setContent = (state, action) => {
    console.log('yoooo', action)
    return {
        ...state,
        data: action.data,
        loading: false,
        entityType: action.entityType
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_CONTENT: return setContent(state, action)
        case actionTypes.SAVE_PAGE_CONTENT_START: return saveContentStart(state, action)
        case actionTypes.SAVE_PAGE_CONTENT_FAIL: return saveContentFail(state, action)
        default: return state
    }
}

export default reducer