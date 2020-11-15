import React from 'react';
import './SudoAccordion.css';
import { connect } from 'react-redux';
import ArrowIcon from 'react-ionicons/lib/IosArrowDropright';
import { NavLink } from 'react-router-dom';

class SudoAccordion extends React.Component {
    state = {
        isMouseOver: false
    }

    onMouseOver = () => {
        this.setState({isMouseOver: true});
    }

    onMouseOut = () => {
        this.setState({isMouseOver: false});
    }

    render() {
        return (
            <NavLink to={window.location.pathname + '/' + this.props.accordionName.split(' ').join('_')} className='SudoAccordion'>
                <div className='SudoAccordionTab' onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
                    <span>{this.props.accordionName}</span>
                    <span className='SudoAccordionControl'>
                        <ArrowIcon id='OpenAccordion' fontSize='1.25em' color={(this.state.isMouseOver) ? '#ffffff' : '#3160D5'} />
                    </span>
                </div>
            </NavLink>
        )
    }
}


const mapStateToProp = state => {
    return {
        content: state.content.content,
        formData: state.content.formData,
        activePagePK: state.content.activePagePK,
        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeActiveContent: (content) => dispatch({ type: 'CHANGE_ACTIVE_CONTENT', content }),
        changeActiveFormData: (formData) => dispatch({ type: 'CHANGE_ACTIVE_FORMDATA', formData }),
        changeBarData: (barData) => dispatch({ type: 'CHANGE_BAR_DATA', barData })
    };
};

export default connect(mapStateToProp, mapDispatchToProps)(SudoAccordion);