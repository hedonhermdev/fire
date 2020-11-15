import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import SideBar from './components/SideBar/SideBar';
import ContentWrapper from './components/ContentWrapper/ContentWrapper';
import Aux from './components/hoc/Aux/Aux';
import Login from './components/Login/Login';
import { Route, Redirect } from 'react-router-dom';
import Modal from './components/UI/Modal/Modal';
import AddPageForm from "./components/AddPageForm/AddPageForm";
import EditPageForm from "./components/EditPageForm/EditPageForm";
import AddPageGroupForm from "./components/AddPageGroupForm/AddPageGroupForm";
import EditPageGroupForm from "./components/EditPageGroupForm/EditPageGroupForm";

class App extends React.Component {
  componentDidMount() {
      const token = localStorage.getItem('token')
      if (token) {
          this.props.loginUser(token);
      } else {
        this.props.logoutUser();
      }
  }

  render() {
    let child;
    if (this.props.loggedIn) {
      let anotherChild;
      if (this.props.dialogBoxContent) {
        anotherChild = (
          <Modal show={true} modalClose={this.props.closeDialogBox}>
            {(this.props.dialogBoxContent === 'AddPageForm') ? <AddPageForm closeDialogBox={this.props.closeDialogBox} /> : null}
            {(this.props.dialogBoxContent === 'EditPageForm') ? <EditPageForm closeDialogBox={this.props.closeDialogBox} /> : null}
            {(this.props.dialogBoxContent === 'AddPageGroupForm') ? <AddPageGroupForm closeDialogBox={this.props.closeDialogBox} /> : null}
            {(this.props.dialogBoxContent === 'EditPageGroupForm') ? <EditPageGroupForm closeDialogBox={this.props.closeDialogBox} /> : null}
          </Modal>
        )
      }

      child = (
        <Aux>
          <SideBar />
          <ContentWrapper />
          {anotherChild}
        </Aux>
      )
    }
    return (
      <div className="App">
        <Route path='/' render={() => (this.props.loggedIn) ? child : <Redirect to='/login' />} />
        <Route path='/login' exact component={(this.props.loggedIn) ? () => <Redirect to='/' /> : Login} />
      </div>
    );
  }
}

const mapStateToProp = state => {
    return {
      loggedIn: state.auth.loggedIn,
      dialogBoxContent: state.dialogBox.dialogBoxContent
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginUser: (token) => dispatch({ type: 'LOGIN_USER', token }),
        logoutUser: (token) => dispatch({ type: 'LOGOUT_USER' }),
        closeDialogBox: () => dispatch({ type: 'CLOSE_DIALOG_BOX' })
    };
};

export default connect(mapStateToProp, mapDispatchToProps)(App);