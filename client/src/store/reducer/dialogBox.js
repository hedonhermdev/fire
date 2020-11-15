import * as auth from '../actions/dialogBox';

const initialState = {
    dialogBoxContent: null,
    editFormData: null
}

const dialogBox = (state = {initialState}, action) => {
    const { type } = action;

    if( type === auth.SHOW_DIALOG_BOX) {
        return {
            ...state,
            dialogBoxContent: action.content
        }
    }

    if( type === auth.CLOSE_DIALOG_BOX) {
        return {
            ...state,
            dialogBoxContent: null,
            editFormData: null
        }
    }

    if( type === auth.CHANGE_EDIT_FORM_DATA) {
        const data = {
            pk: action.pk,
            name: action.name
        }
        return {
            ...state,
            editFormData: data,
            dialogBoxContent: action.content
        }
    }

    return state;
}

export default dialogBox;