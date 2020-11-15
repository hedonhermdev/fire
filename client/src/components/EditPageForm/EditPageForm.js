import React from 'react';
import './EditPageForm.css';
import { connect } from 'react-redux';
import axios from "axios";
import * as api from '../../constants/api'

class EditPageForm extends React.Component {
    submitEditPage = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        axios.put(api.EDIT_PAGE + this.props.editFormData.pk, formData, {
            headers: {
                "Authorization" :"Bearer " + this.props.token
            }
        })
        .then(response => {
            this.props.enableUpdateContent();
            this.props.closeDialogBox();
        })
        .catch(error => {
            alert(error);
        });
    }
    
    render() {
        return (
            <form className='AddPageForm' onSubmit={(e) => this.submitEditPage(e)}>
                <h2>Edit Page</h2>
                <label>Name </label>
                <input type='text' name='name' id='name' required defaultValue={this.props.editFormData.name} />
                <div className='FieldWrapper'>
                    <button type='submit'>Save</button>
                    <button type='button' onClick={this.props.closeDialogBox}>Cancel</button>
                </div>
            </form>
        )
    }
}

const mapStateToProp = state => {
    return {
        token: state.auth.token,
        editFormData: state.dialogBox.editFormData
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableUpdateContent: (content) => dispatch({ type: 'ENABLE_UPDATE_CONTENT' })
    }
}

export default connect(mapStateToProp, mapDispatchToProps)(EditPageForm);