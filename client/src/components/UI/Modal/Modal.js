import React, { Component } from 'react';
import './Modal.css';
import Aux from '../../hoc/Aux/Aux';
import Backdrop from '../Backdrop/Backdrop';

class modal extends Component {
    shouldComponentUpdate (nextProps, nextState) {
        return nextProps.show !==this.props.show || nextProps.children !== this.props.children;
    }

    render() {
        return (
            <Aux>
                <Backdrop 
                    show={ this.props.show } 
                    click={ this.props.modalClose } />
                <div 
                    className='Modal' 
                    style={{
                        transform: this.props.show ? 'translate(-50%, -50%)' : 'translate(-50%, -150%)',
                        opacity: this.props.show ? 1 : 0
                    }}>
                    { this.props.children }
                </div>
            </Aux>
        );
    }
}

export default modal;