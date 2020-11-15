import React from 'react';
import { connect } from 'react-redux';
import './NavAccordion.css';
import AddIcon from 'react-ionicons/lib/IosAddCircle';
import SubtractIcon from 'react-ionicons/lib/IosRemoveCircle';
import EditIcon from 'react-ionicons/lib/IosSettings';
import axios from 'axios';
import * as api from '../../../../../constants/api';

class NavAccordion extends React.Component {
    state = {
        isMouseOver: false,
        isExpanded: false
    }

    onMouseOver = () => {
        this.setState({isMouseOver: true});
    }

    onMouseOut = () => {
        this.setState({isMouseOver: false});
    }

    toggleAccordion = () => {
        this.setState({isExpanded: !this.state.isExpanded});
    }

    addNewDescription = (e) => {
        e.stopPropagation();

        axios.post(api.ADD_DESCRIPTION + this.props.activePagePK + '/' + this.props.accordionPosition, this.props.formData.positionData[this.props.accordionPosition].descriptionTemplate, {
            headers: {
                "Authorization" :"Bearer "+ this.props.token            
            }
        })
        .then(response => {
            const newFormData = {...this.props.formData};
            newFormData.descriptions.push(response.data)
            this.props.changeActiveFormData(newFormData);
        })
        .catch(error => {
          alert(error);
        });
    }

    render() {
        let child = null;
        if (this.props.children.length !== 0) {
            child = this.props.children.map(subNavAccorion => (
                <NavAccordion key={subNavAccorion.pk} accordionName={subNavAccorion.name} barPK={subNavAccorion.pk}>{subNavAccorion.entries}</NavAccordion>
            ));
        }

        let icon;
        if (this.state.isExpanded) {
            icon = [
                (<div className='AddDescription' key='Add New' onClick={(e) => this.addNewDescription(e)}>Add New</div>),
                (<SubtractIcon id='CloseAccordion' key='Close Accordion' fontSize='1.25em' color={(this.state.isMouseOver || this.state.isExpanded) ? '#ffffff' : '#333333'} />)
            ]
        } else {
            icon = (<AddIcon id='OpenAccordion' fontSize='1.25em' color={(this.state.isMouseOver || this.state.isExpanded) ? '#ffffff' : '#333333'} />)
        }

        let accordionPanel;
        if (this.state.isExpanded) {
            accordionPanel = (
                <div className='AccordionPanel'>
                    {child}
                </div>
            )
        }

        return (
            <div className='Accordion'>
                <div className='AccordionTab' onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.toggleAccordion} style={(this.state.isExpanded) ? {'background': '#262e70', 'color': '#ffffff'} : {}}>
                    <span>{this.props.accordionName}</span>
                    <span className='AccordionControl'>
                        <EditIcon style={{marginRight: '24px'}} id='CloseAccordion' key='Close Accordion' fontSize='1.25em' color={(this.state.isMouseOver || this.state.isExpanded) ? '#ffffff' : '#333333'} />
                        {(this.props.children.length !== 0) ? icon : null}
                    </span>
                </div>
                {(this.props.children.length !== 0) ? accordionPanel : null}
            </div>
        )
    }
}

const mapStateToProp = state => {
    return {
        positionMap: state.content.positionMap,
        activePagePK: state.content.activePagePK,
        formData: state.content.formData,
        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeActiveFormData: (formData) => dispatch({ type: 'CHANGE_ACTIVE_FORMDATA', formData })
    };
};

export default connect(mapStateToProp, mapDispatchToProps)(NavAccordion);