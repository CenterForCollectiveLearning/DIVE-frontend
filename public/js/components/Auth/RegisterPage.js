import React, { Component, PropTypes } from 'react';

import { pushState } from 'redux-react-router';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/AuthActions';

import styles from './Auth.sass';

import Input from '../Base/Input'
import BlockingModal from '../Base/BlockingModal';
import RaisedButton from '../Base/RaisedButton';

class AuthPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      email: 'usedive@gmail.com',
      username: '',
      password: 'dive'
    };
  }

  componentWillMount() {
    this.ensureNotLoggedIn(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.ensureNotLoggedIn(nextProps)
  }

  handleEmailChange(e) {
     this.setState({ email: e.target.value });
  }

  handleUsernameChange(e) {
     this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
     this.setState({ password: e.target.value });
  }

  _clickLogin() {
    const { pushState } = this.props;
    pushState(null, '/login')
  }

  ensureNotLoggedIn(props) {
    const { isAuthenticated, pushState } = props;

    if (isAuthenticated){
      pushState(null, props.location.query.next || '/home');
    }
  };

  submit() {
    const { loginUser } = this.props;
    const { email, username, password } = this.state;
    loginUser(email, username, password);
  }

  render() {
    const { authRequired } = this.props;

    if (authRequired) {
      openModal();
    }

    return (
      <BlockingModal
        scrollable
        closeAction={ this.props.closeAction }
        className={ styles.loginModal }
        heading={
          <span>Account Registration</span>
        }
        footer={
          <div className={ styles.footerContent }>
            <div className={ styles.loginText }>
              Already registered? <span className={ styles.loginLink } onClick={ this._clickLogin.bind(this) }>Click here to login</span>.
            </div>
          </div>
        }>
        <form className={ styles.authForm }>
          <div className={ styles.authInputGroup }>
            <div className={ styles.authInputLabel }>E-mail</div>
            <Input
              type="text"
              placeholder="jane@gmail.com"
              autocomplete="on"
              onChange={this.handleEmailChange.bind(this)}
            />
          </div>

          <div className={ styles.authInputGroup }>
            <div className={ styles.authInputLabel }>Username</div>
            <Input
              type="text"
              placeholder="diveuser"
              autocomplete="on"
              onChange={this.handleUsernameChange.bind(this)}
            />
          </div>

          <div className={ styles.authInputGroup }>
            <div className={ styles.authInputLabel }>Password</div>
            <Input
              type="password"
              placeholder="Password"
              onChange={this.handlePasswordChange.bind(this)}
            />
          </div>

          <div className={ styles.authInputGroup }>
            <div className={ styles.authInputLabel }>Confirm Password</div>
            <Input
              type="password"
              placeholder="Password"
              onChange={this.handlePasswordChange.bind(this)}
            />
          </div>
          
          <RaisedButton primary className={ styles.submit } minWidth={ 100 } onClick={ this.submit.bind(this) }>Create your account</RaisedButton>
        </form>
      </BlockingModal>
    );
  }
}

AuthPage.propTypes = {
  authRequired: React.PropTypes.bool
};

function mapStateToProps(state) {
  const { user } = state;
  return { isAuthenticated: user.isAuthenticated };
}

export default connect(mapStateToProps, { loginUser, pushState})(AuthPage);
