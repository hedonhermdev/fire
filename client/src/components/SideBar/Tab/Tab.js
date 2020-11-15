import React, { Component } from 'react';
import './Tab.css';
import { NavLink } from 'react-router-dom'


class Tab extends Component {
    state = {
        expanded: false
    }

    toggleExpand = () => {
        this.setState({expanded: !this.state.expanded});
    }

    render() {
        let child;
        if (this.state.expanded) {
            child = this.props.subTabs.map(subTab => {
                return (
                    <NavLink to={'/' + subTab.split(' ').join('_')} className='SubTab' key={subTab}>{subTab}</NavLink>
                )
            });
        }
        return (
            <div className='SideTab'>
                <div style={{display: 'flex', alignItems: 'center', paddingLeft: '16px', cursor: 'pointer'}} onClick={this.toggleExpand}>
                    <img src={require('../../../asstets/icons8-expand-arrow-16 2.png')} style={this.state.expanded ? {transform: 'rotate(0)'} : {transform: 'rotate(-90deg)'}} alt='DOWN_ARROW' />
                    <span>{this.props.tabName}</span>
                </div>
                {child}
            </div>
        )
    }
}

export default Tab;