import React from 'react';
import { connect } from 'react-redux';
import handleResponse from '../../../../utils/handleResponse';
import request from 'request';
import * as api from '../../../../constants/api';
import { NavLink } from 'react-router-dom';
import DeleteIcon from 'react-ionicons/lib/IosTrash';
import EditIcon from 'react-ionicons/lib/IosSettings';
import axios from 'axios';

import './CampusPageGroups.css';

class PageContentTable extends React.Component {
    state = {
        pageGroups: null,
        pages: null
    }

    fetchContent = () => {
        request({
            method: 'GET',
            url: (window.location.pathname === '/Manage_Content') ? api.GET_PAGES_CONTENT : `${api.GET_PAGE_GROUP_CONTENT}/${this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length - 1]}`,
            headers: {
            'Content-Type': 'application/json',
            //   'Access-Control-Allow-Origin': '*',
            'authorization': 'Bearer ' + this.props.token
            },
        }, (error, response, body) => {
            handleResponse(error, response, body, () => {
                try {
                    this.props.disableUpdateContent();
                    body = JSON.parse(body);
                    if (window.location.pathname === '/Manage_Content') {
                        this.setState({pageGroups: body.pageGroups, pages: body.pages});
                    } else {
                        this.setState({pageGroups: body.childGroups, pages: body.childPages});
                    }
                } catch (e) {
                    throw new Error(e.message || "");
                }
            })
        });
    }

    deletePageGroup = (pk) => {
        const sure = window.confirm('Are you sure you wanna delete!');

        if (sure) {
            axios.delete(api.DELETE_PAGE_GROUP + pk, {
                headers: {
                    "Authorization" :"Bearer " + this.props.token
                }
            })
            .then(response => {
                this.fetchContent();
            })
            .catch(error => {
                alert(error);
            });
        }
    }

    deletePage = (pk) => {
        const sure = window.confirm('Are you sure you wanna delete!');

        if (sure) {
            axios.delete(api.DELETE_PAGE + pk, {
                headers: {
                    "Authorization" :"Bearer " + this.props.token
                }
            })
            .then(response => {
                this.fetchContent();
            })
            .catch(error => {
                alert(error);
            });
        }
    }

    componentDidMount() {
        this.fetchContent()
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.fetchContent();
        }
    }

    render() {
        if (this.props.updateContent) {
            this.fetchContent();
        }

        let groups;
        if (this.state.pageGroups) {
            groups = this.state.pageGroups.map(group => (
                <div className='PageGroup' key={group.pk}>
                    <NavLink to={`${this.props.location.pathname}/${group.pk}`} className='PageGroupLink'>
                        <img src={require('../../../../asstets/Vector.png')} className='PageGroupIcon' alt='PAGE_GROUP_ICON' />
                        <div className='PageGroupName'>
                            {group.name}
                        </div>
                    </NavLink>
                    <div className='ActionButtonWrapper'>
                        <DeleteIcon color='#343F44' fontSize='1.1em' style={{marginRight: '10px', marginTop: '4px', cursor: 'pointer'}} onClick={this.deletePageGroup.bind('', group.pk)} />
                        <EditIcon color='#343F44' fontSize='1.1em' style={{cursor: 'pointer'}} onClick={this.props.changeEditFormData.bind('', group.pk, group.name, 'EditPageGroupForm')} />
                    </div>
                </div>
            ));
        }
        let pages;
        if (this.state.pages) {
            pages = this.state.pages.map(page => (
                <div className='Page' key={page.pk}>
                    <NavLink to={`${this.props.location.pathname}/page/${page.pk}`} className='PageLink'>
                        <img src={require('../../../../asstets/canvas.png')} className='PageIcon' alt='PAGE_ICON' />
                        <div className='PageName'>
                            {page.name}
                        </div>
                    </NavLink>
                    <div className='ActionButtonWrapper'>
                        <DeleteIcon color='#343F44' fontSize='1.1em' style={{marginRight: '10px', marginTop: '4px', cursor: 'pointer'}} onClick={this.deletePage.bind('', page.pk)} />
                        <EditIcon color='#343F44' fontSize='1.1em' style={{cursor: 'pointer'}} onClick={this.props.changeEditFormData.bind('', page.pk, page.name, 'EditPageForm')} />
                    </div>
                </div>
            ));
        }
        return (
            <div className='PageGroups'>
                {groups}
                {pages}
            </div>
        )
    }
}

const mapStateToProp = state => {
    return {
        token: state.auth.token,
        updateContent: state.content.updateContent
    };
};

const mapDispatchToProps = dispatch => {
    return {
        disableUpdateContent: () => dispatch({ type: 'DISABLE_UPDATE_CONTENT' }),
        changeEditFormData: (pk, name, content) => dispatch({ type: 'CHANGE_EDIT_FORM_DATA', pk, name, content })
    };
};

export default connect(mapStateToProp, mapDispatchToProps)(PageContentTable);