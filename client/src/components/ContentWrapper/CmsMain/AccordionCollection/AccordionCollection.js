import React from 'react';
import { connect } from 'react-redux';
import Accordion from './Accordion/Accordion';
import axios from 'axios';
import * as api from '../../../../constants/api';

class AccordionCollection extends React.Component {
    state = {
        barData: null
    }

    componentDidMount() {
        if (window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] === 'Navigation_Bar') {
            axios.get(api.GET_BARS + window.location.pathname.split('/')[window.location.pathname.split('/').length - 2], {
                headers: {
                    "Authorization" :"Bearer "+ this.props.token            
                }
            })
            .then(response => {
                this.setState({ barData: response.data });
            })
            .catch(error => {
                alert(error);
            });
        }
    }

    render() {
        let child;
        const accName = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1].split('_').join(' ');
        if (window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] === 'Navigation_Bar') {
            if (this.state.barData) {
                child = this.state.barData.map(bar => (
                    <Accordion accordionName={bar.title} barPosition={bar.position} barPK={bar.pk}></Accordion>
                ));
            }
        } else {
            if (this.props.formData) {
                child = this.props.formData.cmsSchema[accName].positions.map(position => (
                    <Accordion key={position} accordionName={this.props.formData.positionData[position].title} accordionPosition={position}></Accordion>
                ));
            }
        }
        return (
            <div className='AccordionWrapper'>
                {child}
            </div>
        )
    }
}

const mapStateToProp = state => {
    return {
        formData: state.content.formData,
        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeBarData: (barData) => dispatch({ type: 'CHANGE_BAR_DATA', barData })
    };
};

export default connect(mapStateToProp, mapDispatchToProps)(AccordionCollection);