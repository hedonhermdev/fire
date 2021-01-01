import update from 'immutability-helper'

import * as actionTypes from '../actions/actionTypes'

const initialState = {
    error: null,
    breadCrumb: [],
    loading: true,
    entityType: 'PAGE_GROUP',
    pageGroup: {
        pageGroups: [],
        pages: [],
        _id: '',
        name: '',
        baseUrl: ''
    },
    page: {
        _id: '',
        active: false,
        name: '',
        url: '',
        dataBlock: null
    }
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
    let updateObj = {}
    if (action.entityType === 'PAGE') {
        updateObj = {
            _id: {$set: action.data._id},
            active: {$set: action.data.active},
            name: {$set: action.data.name},
            url: {$set: action.data.url},
            dataBlock: {$set: action.data.dataBlock}
        }
    }
    else {
        updateObj = {
            _id: {$set: action.data._id},
            name: {$set: action.data.name},
            pageGroups: {$set: action.data.pageGroups},
            pages: {$set: action.data.pages},
            baseUrl: {$set: action.data.baseUrl}
        }
    }
    const newState = update(state, {
        data: {$set: action.data},
        [action.entityType === 'PAGE' ? 'page' : 'pageGroup']: updateObj,
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

const addPageGroup = (state, action) => {
    return update(state, {
        pageGroup: {
            pageGroups: {
                $push: [{
                    name: action.pageGroup.name,
                    _id: action.pageGroup._id
                }]
            }
        }
    })
}

const addPage = (state, action) => {
    return update(state, {
        pageGroup: {
            pages: {
                $push: [{
                    name: action.page.name,
                    _id: action.page._id
                }]
            }
        }
    })
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
        case actionTypes.ADD_PAGE_GROUP: return addPageGroup(state, action)
        case actionTypes.ADD_PAGE: return addPage(state, action)
        default: return state
    }
}

export default reducer