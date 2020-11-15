import React from 'react';
import { connect } from 'react-redux';
import Aux from '../../../hoc/Aux/Aux';
import SudoAccordion from './SudoAccordion/SudoAccordion';
import * as api from '../../../../constants/api';
import request from "request";
import handleResponse from "../../../../utils/handleResponse";

class SudoAccordionCollection extends React.Component {
    state = {
        formData: null
    }
    componentDidMount() {
        request({
            method: 'GET',
            url: `${api.GET_PAGE_DESCRIPTION_LIST}/${window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]}/all`,
            headers: {
              'Content-Type': 'application/json',
              'authorization': 'Bearer ' + this.props.token
            },
        }, (error, response, body) => {
            handleResponse(error, response, body, () => {
                try {
                    body = JSON.parse(body);
                    this.setState({ formData: body });
                    this.props.changeActiveFormData(body);
                } catch (e) {
                    throw new Error(e.message || "");
                }
            })
        });
    }

    render() {
        let anotherChild;
        let child;
        if (this.state.formData && this.state.formData.cmsSchema) {
            const keys = Object.keys(this.state.formData.cmsSchema);
            child = keys.map(key => (
                <SudoAccordion accordionName={key} key={key}></SudoAccordion>
            ));
            anotherChild = <SudoAccordion accordionName='Navigation Bar'></SudoAccordion>
        }
        return (
            <Aux>
                {child}
                {anotherChild}
            </Aux>
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
        changeActiveFormData: (formData) => dispatch({ type: 'CHANGE_ACTIVE_FORMDATA', formData })
    };
};

export default connect(mapStateToProp, mapDispatchToProps)(SudoAccordionCollection);