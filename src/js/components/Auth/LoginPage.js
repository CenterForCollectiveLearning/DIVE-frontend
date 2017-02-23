import React, { Component, PropTypes } from 'react';

import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/AuthActions';

import { Button, Intent, Checkbox } from '@blueprintjs/core';
import styles from './Auth.sass';

import Input from '../Base/Input'
import AuthModal from '../Base/AuthModal';
import RaisedButton from '../Base/RaisedButton';

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginError: null,
      error: null,
      email: '',
      username: '',
      password: '',
      rememberMe: true
    };
  }

  componentWillMount() {
    this.ensureNotLoggedIn(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loginError: nextProps.loginError
    });
    this.ensureNotLoggedIn(nextProps);
  }

  sanitizeBackendErrors = () => {
    if (this.state.loginError) {
      this.setState({
        loginError: null
      })
    }
  }

  closeLoginPage = () => {
    const { push } = this.props;
    push('/')
  }

  handleUsernameOrEmailChange = (e) => {
    const value = e.target.value;
    this.sanitizeBackendErrors();
    if (validateEmail(value)) {
      this.setState({
        email: value,
        username: ''
      });
    } else {
      this.setState({
        email: '',
        username: value
      });
    }
  }

  handlePasswordChange = (e) => {
    this.sanitizeBackendErrors();
    this.setState({ password: e.target.value });
  }

  clickRegister = () => {
    const { push } = this.props;
    push('/auth/register');
  }

  clickForgot = () => {
    const { push } = this.props;
    push('/auth/forgot');
  }

  handleRememberMeChange = (e) => {
    this.setState({ rememberMe: !this.state.rememberMe });
  }

  validateForm = () => {
    const { email, username, password } = this.state;
    return (( email || username ) && (password && (password != null)))
  }

  ensureNotLoggedIn(props) {
    const { isAuthenticated, push } = props;

    if (isAuthenticated){
      push(props.location.query.next || '/projects');
    }
  };

  submit = (e) => {
    const { loginUser } = this.props;
    const { email, username, password, rememberMe } = this.state;

    e.preventDefault();
    loginUser(email, username, password, rememberMe);
  }

  render() {
    const { authRequired } = this.props;
    const { email, username, password, loginError } = this.state;
    const loginDisabled = !this.validateForm();

    if (authRequired) {
      openModal();
    }

    return (
      <DocumentTitle title='DIVE | Login'>
        <AuthModal
          scrollable
          titleText="Log in to DIVE"
          isOpen={ true }
          closeAction={ this.closeLoginPage }
          className={ styles.loginModal }
          blackBackground={ true }
          authType="login"
          footer={
            <div className={ styles.registerText }>
              Don&#39;t have an account? <span className={ styles.registerLink } onClick={ this.clickRegister }>Click here to create one</span>.
            </div>
          }>
          <form className={ styles.authForm } onSubmit={ this.submit }>
            <div className={ styles.authInputGroup }>
              { (loginError == 'E-mail not found' || loginError == 'Username not found') &&
                <div className={ styles.authInputError }>Not found</div>
              }
              <div className="pt-input-group pt-large">
                <input
                  type="text"
                  className={ "pt-input pt-large pt-icon-user pt-fill " + ((loginError == 'E-mail not found' || loginError == 'Username not found') ? 'pt-intent-warning' : '') }
                  placeholder="Username or E-mail"
                  autoComplete="on"
                  onChange={ this.handleUsernameOrEmailChange }
                  autoFocus={ true }
                />
                <span className="pt-icon pt-minimal pt-icon-user" />
              </div>
            </div>
            <div className={ styles.authInputGroup }>
              { (loginError == 'Incorrect credentials') &&
                <div className={ styles.authInputError }>Incorrect</div>
              }
              <div className="pt-input-group pt-large">
                <input
                  className={ 'pt-input pt-large pt-icon-lock pt-fill ' + ((loginError == 'Incorrect credentials') ? 'pt-intent-warning' : '' ) }
                  type="password"
                  placeholder="Password"
                  onChange={ this.handlePasswordChange }
                />
                <span className="pt-icon pt-minimal pt-icon-lock" />
              </div>
            </div>
            <div className={ styles.authInputGroup }>
              <Checkbox
                className={ styles.rememberMe }
                checked={ this.state.rememberMe }

                label="Remember Me"
              />
              <span className={ styles.forgotPassword } onClick={ this.clickForgot }>Forgot Password?</span>
            </div>
            <Button
              className="pt-large pt-fill"
              text="Login"
              type="submit"
              intent={ Intent.PRIMARY }
              disabled={ loginDisabled }
              onClick={ this.submit }
            />
          </form>
        </AuthModal>
      </DocumentTitle>
    );
  }
}

LoginPage.propTypes = {
  authRequired: React.PropTypes.bool
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    isAuthenticated: user.isAuthenticated,
    loginError: user.error.login
  };
}

export default connect(mapStateToProps, {
  loginUser,
  push
})(LoginPage);
