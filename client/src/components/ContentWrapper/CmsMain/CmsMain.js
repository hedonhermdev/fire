import React from 'react';
import { connect } from 'react-redux';
import './CmsMain.css';
import CampusPageGroups from './CampusPageGroups/CampusPageGroups';
import SudoAccordionCollection from './SudoAccordionCollection/SudoAccordionCollection';
import AccordionCollection from './AccordionCollection/AccordionCollection';
import Routing from './Routing/Routing';
import { NavLink, Switch, Route } from "react-router-dom";

class CmsMain extends React.Component {
    render() {
        const breadcrumb = this.props.location.pathname.replace('/', '').split('/').map(breadcrumbLink => {
            let url = '';
            for (let i = 0; i <= this.props.location.pathname.replace('/', '').split('/').indexOf(breadcrumbLink); i++) {
                url += '/' + this.props.location.pathname.replace('/', '').split('/')[i];
            }
            if (this.props.location.pathname.replace('/', '').split('/').indexOf(breadcrumbLink) === this.props.location.pathname.replace('/', '').split('/').length - 1) {
                return <NavLink to={url} key={breadcrumbLink}>{breadcrumbLink}</NavLink>
            } else {
                return (
                    (breadcrumbLink !== 'page')
                    ? <span key={breadcrumbLink}>
                        <NavLink to={url} key={breadcrumbLink}>{breadcrumbLink}</NavLink>
                        <span>{' / '}</span>
                    </span>
                    : ''
                )
            }
        })

        return (
            <div className='CmsMain'>
                <div className='Heading' style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{display: 'flex', alignItems: 'center'}}>{breadcrumb}</span>
                    {
                        (!this.props.location.pathname.split('/').includes('page'))
                        ? <div>
                            <button onClick={() => this.props.showDialogBox('AddPageGroupForm')} className='AddPageButton'>Add Page Group</button>
                            <button onClick={() => this.props.showDialogBox('AddPageForm')} className='AddPageButton'>Add Page</button>
                        </div>
                        : ''
                    }
                </div>
                {
                    this.props.location.pathname.split('/').includes('page')
                    ? <Routing />
                    : <Route path='/Manage_Content' component={CampusPageGroups} />
                }
            </div>
        )
    }
}

const mapStateToProp = state => {
    return {
        formData: state.content.formData
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeActiveFormData: (formData) => dispatch({ type: 'CHANGE_ACTIVE_FORMDATA', formData }),
        showDialogBox: (content) => dispatch({ type: 'SHOW_DIALOG_BOX', content }),
        changeActivePagePK: (activePagePK) => dispatch({ type: 'CHANGE_ACTIVE_PAGE_PK', activePagePK })
    };
};

export default connect(mapStateToProp, mapDispatchToProps)(CmsMain);