import * as actionTypes from './actionTypes'

export const updateBreadCrumb = (newBreadCrumb, currentEntityName) => {
    return {
        type: actionTypes.UPDATE_NAV_BREADCRUMB,
        newBreadCrumb,
        currentEntityName
    }
}