import * as content from '../actions/content';

const initialState = {
    activePageGroupPK: null,
    formData: null,
    positionMap: null,
    updateContent: false
}

const contents = (state = initialState, action) => {
    const { type } = action;

    if (type === content.CHANGE_ACTIVE_PAGE_GROUP_PK) {
        return {
            ...state,
            activePageGroupPK: action.activePageGroupPK
        }
    }

    if (type === content.CHANGE_ACTIVE_FORMDATA) {
        const positionMap = {};
        action.formData.descriptions.map(description => {
            if (positionMap[description.position]) {
                positionMap[description.position].push(description);
            } else {
                positionMap[description.position] = [];
                positionMap[description.position].push(description);
            }
            return '';
        });

        return {
            ...state,
            formData: action.formData,
            positionMap: {...positionMap}
        }
    }

    if (type === content.ENABLE_UPDATE_CONTENT) {
        return {
            ...state,
            updateContent: true
        }
    }

    if (type === content.DISABLE_UPDATE_CONTENT) {
        return {
            ...state,
            updateContent: false
        }
    }

    return state;
}
export default contents;