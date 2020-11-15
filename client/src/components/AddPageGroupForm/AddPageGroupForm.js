import React from 'react';
import './AddPageGroupForm.css';
import { connect } from 'react-redux';
import axios from "axios";
import * as api from '../../constants/api'
// import request from 'request';

class AddPageGroupForm extends React.Component {
    // state = {
    //     pageTemplates: null
    // }

    // componentDidMount() {
    //     request({
    //         method: 'GET',
    //         url: api.GET_PAGE_TEMPLATES,
    //         headers: {
    //           'Content-Type': 'application/json',
    //         //   'Access-Control-Allow-Origin': '*',
    //           'authorization': 'Bearer ' + this.props.token
    //           },
    //     }, (error, response, body) => {
    //         body = JSON.parse(body);
    //         this.setState({ pageTemplates: body });
    //     });
    // }

    submitAddPage = (e) => {
        e.preventDefault();

        let parentId = -1;
        if (window.location.pathname !== '/Manage_Content') {
            parentId = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
        }

        const formData = new FormData(e.target);
        formData.append('parentId', parentId);

        axios.post(api.ADD_PAGE_GROUP, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
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
        // let templatesOption;
        // if (this.state.pageTemplates) {
        //     templatesOption = this.state.pageTemplates.map(template => (
        //         <option key={template.id} id={template.id} value={template.id}>{template.name}</option>
        //     ));
        // }

        return (
            <form className='AddPageForm' onSubmit={(e) => this.submitAddPage(e)}>
              <h2>Add New Page</h2>
              <label>Name </label>
              <input type='text' name='name' id='name' required />
              {/* <label>Template </label>
              <select name='templateId' id='templateId' required>
                {templatesOption}
              </select> */}
              <div className='FieldWrapper'>
                <button type='submit'>Add Page</button>
                <button type='button' onClick={this.props.closeDialogBox}>Cancel</button>
              </div>
            </form>
        )
    }
}

const mapStateToProp = state => {
    return {
        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        enableUpdateContent: (content) => dispatch({ type: 'ENABLE_UPDATE_CONTENT' })
    }
}

export default connect(mapStateToProp, mapDispatchToProps)(AddPageGroupForm);