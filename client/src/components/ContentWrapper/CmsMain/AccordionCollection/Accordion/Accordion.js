import React from 'react';
import { connect } from 'react-redux';
import './Accordion.css';
import AddIcon from 'react-ionicons/lib/IosAddCircle';
import SubtractIcon from 'react-ionicons/lib/IosRemoveCircle';
import SubAccordion from './SubAccordion/SubAccordion';
import axios from 'axios';
import * as api from '../../../../../constants/api';

class Accordion extends React.Component {
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

        axios.post(api.ADD_PAGE_DESCRIPTION, 
            {
                pageId: window.location.pathname.split('/')[window.location.pathname.split('/').length - 2],
                position: this.props.accordionPosition,
                content_data: this.props.formData.positionData[this.props.accordionPosition].descriptionTemplate.content_data
            }, 
            {
                headers: {
                    "Authorization" :"Bearer "+ this.props.token            
                }
            }
        )
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
        const positionMap = this.props.positionMap;
        if (Object.keys(positionMap).length !== 0) {
            if (positionMap[this.props.accordionPosition]) {
                child = positionMap[this.props.accordionPosition].map(desc => (
                    <SubAccordion accordionName={desc.description_title || 'Description'} key={desc.id} accordionId={desc.id}>{desc.content_data}</SubAccordion>
                ));
            }
        }

        let icon;
        if (this.state.isExpanded) {
            icon = [
                (<div className='AddDescription' key='Add New' onClick={(e) => this.addNewDescription(e)}>Add New</div>),
                (<SubtractIcon id='CloseAccordion' key='Close Accordion' fontSize='1.25em' color={(this.state.isMouseOver || this.state.isExpanded) ? '#ffffff' : '#3160D5'} />)
            ]
        } else {
            icon = (<AddIcon id='OpenAccordion' fontSize='1.25em' color={(this.state.isMouseOver || this.state.isExpanded) ? '#ffffff' : '#3160D5'} />)
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
                <div className='AccordionTab' onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.toggleAccordion} style={(this.state.isExpanded) ? {'background': '#3160D5', 'color': '#ffffff'} : {}}>
                    <span>{this.props.accordionName}</span>
                    <span className='AccordionControl'>
                        {icon}
                    </span>
                </div>
                {accordionPanel}
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

export default connect(mapStateToProp, mapDispatchToProps)(Accordion);