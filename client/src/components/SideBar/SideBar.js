import React from 'react';
import { connect } from 'react-redux';
import './SideBar.css';
import Tab from './Tab/Tab';
import sideBarLinks from '../../constants/sideBarLinks';

class SideBar extends React.Component {
    render() {
        console.log(localStorage.getItem('username'));
        let child = Object.keys(sideBarLinks).map(link => (
            <Tab key={link} tabName={link} subTabs={sideBarLinks[link]} subTabsClick={this.openContentTable} />
        ))
        return(
            <div className='SideBar'>
                <div className='TitleName'>
                    BITS Website CMS
                </div>
                {child}
                <div className='UserProfile'>
                    <img src={require('../../asstets/icons8-user-30 1.png')} className='UserIcon' alt='USER_ICON' />
                    <div>
                        <div className='UserName'>{localStorage.getItem('username')}</div>
                        <div className='UserEmail'>{localStorage.getItem('username')}@pilani.bits-pilani.ac.in</div>
                    </div>
                </div>
            </div>
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
        changeActiveContent: (content) => dispatch({ type: 'CHANGE_ACTIVE_CONTENT', content })
    };
};

export default connect(mapStateToProp, mapDispatchToProps)(SideBar);