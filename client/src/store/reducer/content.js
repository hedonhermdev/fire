import update from 'immutability-helper'

import * as actionTypes from '../actions/actionTypes'

const initialState = {
    error: null,
    breadCrumb: [],
    loading: true,
    entityType: 'PAGE_GROUP',
    data: {}
}

const openEntityStart = (state, action) => {
    return update(state, {
        loading: {$set: true}
    })
}

const openEntityFail = (state, action) => {
    return {
        ...state,
        loading: false,
        error: action.error
    }
}

const setContent = (state, action) => {
    const newState = update(state, {
        data: {$set: action.data},
        loading: {$set: false},
        entityType: {$set: action.entityType},
        breadCrumb: {
            $apply: function(bc) {
                const newbc = []
                console.log(action.data._id)
                const notFound = bc.every((item) => {
                    newbc.push(item)
                    return item.id !== action.data._id
                })

                if (notFound || bc.length === 0) {
                    const name = action.data.name === '__main' ? 'Home' : action.data.name
                    newbc.push({
                        name: name,
                        id: action.data._id
                    })
                }
                return newbc
            }
        }
    })
    console.log(newState)
    return newState
}

const saveContentStart = (state, action) => {
    return update(state, {
        data: {
            dataBlock: {
                data: {$set: action.data}
            }
        }
    })
}

const saveContentFail = (state, action) => {
    return update(state, {
        loading: {$set: false}
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.NAV_OPEN_ENTITY_START: return openEntityStart(state, action)
        case actionTypes.NAV_OPEN_ENTITY_FAIL: return openEntityFail(state, action)
        case actionTypes.SET_CONTENT: return setContent(state, action)
        case actionTypes.SAVE_PAGE_CONTENT_START: return saveContentStart(state, action)
        case actionTypes.SAVE_PAGE_CONTENT_FAIL: return saveContentFail(state, action)
        default: return state
    }
}

export default reducer