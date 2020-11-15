import React from 'react';
import { connect } from 'react-redux';
import './SubAccordion.css';
import TrashIcon from 'react-ionicons/lib/IosTrash';
import AddIcon from 'react-ionicons/lib/IosAddCircle';
import SubtractIcon from 'react-ionicons/lib/IosRemoveCircle';
import ArrowDown from 'react-ionicons/lib/IosArrowRoundDown';
import * as api from '../../../../../../constants/api';
import axios from 'axios';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Spinner from '../../../../../UI/Spinner/Spinner';
import Aux from '../../../../../hoc/Aux/Aux';
var pretty = require('pretty');

class Accordion extends React.Component {
    state = {
        isMouseOver: false,
        isExpanded: false,
        isLoading: false
    }

    componentDidMount() {
        this.props.children.map(content => {
            if (content.cms_formfield_type === 'textarea') {
                this.setState({[content.id]: content.value});
                this.setState({[content.id + 'htmlView']: false});
            }
            return '';
        })
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

    saveUpdate = (e) => {
        this.setState({ isLoading: true });
        const formData = new FormData();
        let isUpdated = false;

        for(let i = 0; i < this.props.children.length; i++) {
            if (this.props.children[i].cms_formfield_type === 'image') {
                if (e.target.childNodes[i].lastChild.files[0]) {
                    formData.append('cdata_' + this.props.children[i].id, e.target.childNodes[i].lastChild.files[0]);
                    isUpdated = true;
                }
            } else {
                if (e.target.childNodes[i].lastChild.value !== this.props.children[i].value) {
                    formData.append('cdata_' + this.props.children[i].id, e.target.childNodes[i].lastChild.value);
                    isUpdated = true;
                }
            }
        }
        if (!isUpdated) {
            alert('No changes detected!');
            return;
        }

        this.props.children.map(content => {
            if (content.cms_formfield_type === 'textarea') {
                formData.set('cdata_' + content.id, this.state[content.id]);
            }
            return '';
        });

        axios.put(api.UPDATE_PAGE_DESCRIPTION + this.props.accordionId, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization" :"Bearer " + this.props.token
            }
        })
        .then(response => {
            const newFormData = {...this.props.formData};
            let index;
            newFormData.descriptions.map(desc => {
                if (desc.id === this.props.accordionId) {
                    index = newFormData.descriptions.indexOf(desc);
                }
                return '';
            });
            newFormData.descriptions[index] = response.data;
            this.props.changeActiveFormData(newFormData);

            this.setState({ isLoading: false });
        })
        .catch(error => {
          alert(error);
        });
    }

    deleteDescription = (e) => {
        e.stopPropagation();

        axios.delete(api.DELETE_PAGE_DESCRIPTION + this.props.accordionId, {
            headers: {
                "Authorization" :"Bearer " + this.props.token
            }
        })
        .then(response => {
            const newFormData = {...this.props.formData};
            let index;
            newFormData.descriptions.map(desc => {
                if (desc.id === this.props.accordionId) {
                    index = newFormData.descriptions.indexOf(desc);
                }
                return '';
            });
            newFormData.descriptions.splice(index, 1);
            this.props.changeActiveFormData(newFormData);
        })
        .catch(error => {
            alert(error);
        });
    }

    render() {
        let child = [];
        this.props.children.map(content => {
            let htmlView = (
                <Aux>
                    <ArrowDown fontSize='3em' color='#aaaaaa' />
                    <textarea defaultValue={pretty(this.state[content.id])} onChange={(e) => this.setState({[content.id]: e.target.value})}></textarea>
                    <div style={{width: '100%', textAlign: 'end', fontSize: '0.95rem', color: '#aaa', marginTop: '8px'}}><span style={{cursor: 'pointer'}} onClick={() => this.setState({[content.id + 'htmlView']: false})}>Hide HTML View</span></div>
                </Aux>
            );

            switch (content.cms_formfield_type) {
                case 'textarea': {
                    child.push(
                        <div key={content.id} id={content.id}>
                            <label>{content.key}: </label>
                            <div className='TextAreaWrapper'>
                                <CKEditor
                                onChange={ ( event, editor ) => this.setState({ [content.id]: editor.getData() }) }
                                editor={ ClassicEditor }
                                data={this.state[content.id]} />
                                {(this.state[content.id + 'htmlView']) ? htmlView : <div style={{width: '100%', textAlign: 'end', fontSize: '0.9rem', color: '#aaa', marginTop: '8px'}}><span style={{cursor: 'pointer'}} onClick={() => this.setState({[content.id + 'htmlView']: true})}>Show HTML View</span></div>}
                            </div>
                        </div>
                    )
                    break;
                }

                case 'text': {
                    child.push(
                        <div key={content.id} id={content.id}>
                            <label>{content.key}: </label>
                            <input type='text' defaultValue={content.value} />
                        </div>
                    )
                    break;
                }
                
                case 'image': {
                    child.push(
                        <div key={content.id} id={content.id}>
                            <div className='FieldWrapper'>
                                <label>{content.key}: </label>
                                <img src={api.API_BASE + content.value} alt={content.value} />
                            </div>
                            <input type='file' />
                        </div>
                    )
                    break;
                }
            
                default:
                    break;
            }
            return '';
        });

        let icon;
        if (this.state.isExpanded) {
            icon = (<SubtractIcon id='CloseAccordion' fontSize='1.25em' color={(this.state.isMouseOver || this.state.isExpanded) ? '#ffffff' : '#3160D5'} />)
        } else {
            icon = (<AddIcon id='OpenAccordion' fontSize='1.25em' color={(this.state.isMouseOver || this.state.isExpanded) ? '#ffffff' : '#3160D5'} />)
        }

        let accordionPanel;
        if (this.state.isExpanded) {
            accordionPanel = (
                <div className='SubAccordionPanel'>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        this.saveUpdate(e);
                    }}>
                        {child}
                        {(this.state.isLoading) ? <Spinner/> : <input type='submit' value='SAVE' />}
                    </form>
                </div>
            )
        }

        return (
            <div className='SubAccordion'>
                <div className='SubAccordionTab' onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.toggleAccordion} style={(this.state.isExpanded) ? {'background': '#3160D5', 'color': '#ffffff'} : {}}>
                    <span>{this.props.accordionName}</span>
                    <span className='SubAccordionControl'>
                        <TrashIcon id='OpenAccordion' fontSize='1.25em' color={(this.state.isMouseOver || this.state.isExpanded) ? '#ffffff' : '#3160D5'} onClick={(e) => this.deleteDescription(e)} />
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
        token: state.auth.token,
        formData: state.content.formData
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeActiveFormData: (formData) => dispatch({ type: 'CHANGE_ACTIVE_FORMDATA', formData })
    };
};

export default connect(mapStateToProp, mapDispatchToProps)(Accordion);