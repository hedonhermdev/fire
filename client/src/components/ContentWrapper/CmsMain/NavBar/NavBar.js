import React from 'react';
import { connect } from 'react-redux';

class NavBar extends React.Component {
    render() {
        let child;
        child = this.props.barData.map(bar => (
            <NavBarElem title={bar.title}>{bar.entries}</NavBarElem>
        ));

        return (
            <div className='NavBar'>
                {child}
            </div>
        )
    }
}

const mapStateToProp = state => {
    return {
        barData: state.content.barData
    };
};

export default connect(mapStateToProp)(NavBar);