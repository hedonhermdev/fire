import * as actionTypes from './actionTypes'

export const loadMeta = ({ pageTemplates, pgTemplates }) => {
    return {
        type: actionTypes.LOAD_META,
        pageTemplates,
        pgTemplates
    }
}