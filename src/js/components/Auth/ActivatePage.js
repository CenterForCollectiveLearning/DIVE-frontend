import React, { Component, PropTypes } from 'react';

import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { confirmToken, registerUser } from '../../actions/AuthActions';
import { validateEmail } from '../../helpers/auth';

import styles from './Auth.sass';

import { Button, Intent, Checkbox } from '@blueprintjs/core';

import Loader from '../Base/Loader';
import Input from '../Base/Input'
import AuthModal from '../Base/AuthModal';
import RaisedButton from '../Base/RaisedButton';


class ActivatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
      emailAlreadyTaken: null,
      usernameAlreadyTaken: null,
      usernameTooShort: null,
      usernameTooLong: null,
      emailValid: null,
      emailTaken: null,
      usernameTaken: null,
      passwordMatching: null,
      passwordScore: null,
      passwordFeedbackWarning: '',
      passwordFeedbackSuggestions: ''
    };
  }

  closeRegistrationPage = () => {
    const { push } = this.props;
    push('/')
  }

  componentWillMount() {
    const { params, confirmToken } = this.props;
    const { token } = params;
    this.ensureNotLoggedIn(this.props)
    confirmToken(token);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      emailError: nextProps.emailError,
      usernameError: nextProps.usernameError,
    });
    this.ensureNotLoggedIn(nextProps)
  }

  sanitizeBackendErrors = () => {
    this.setState({
      emailError: null,
      usernameError: null,
    })
  }

  handleEmailChange = (e) => {
    const email = e.target.value;
    const emailValid = validateEmail(email)
    this.sanitizeBackendErrors();
    this.setState({
      email: e.target.value,
      emailValid: emailValid
    });
  }

  handleUsernameChange = (e) => {
    const username = e.target.value;
    this.sanitizeBackendErrors();
    this.setState({ username: username });
    if (username.length < 3) {
      this.setState({ usernameTooShort: true });
    } else if (username.length > 65 ){
      this.setState({ usernameTooLong: true });
    } else {
      this.setState({
        usernameTooShort: false,
        usernameTooLong: false
      });
    }
  }

  handlePasswordChange = (e) => {
    const password = e.target.value;
    this.sanitizeBackendErrors();

    const passwordTest = zxcvbn(password);
    this.setState({
      password: e.target.value,
      passwordScore: passwordTest.score,
      passwordFeedbackWarning: passwordTest.feedback.warning,
      passwordFeedbackSuggestions: passwordTest.feedback.suggestions,
    });
  }

  _clickProjects = () => {
    const { push } = this.props;
    push('/projects')
  }

  _clickLogin = () => {
    const { push } = this.props;
    push('/auth/login')
  }

  _clickRegister = () => {
    const { push } = this.props;
    push('/auth/register')
  }

  ensureNotLoggedIn(props) {
    const { isAuthenticated, push } = props;

    if (isAuthenticated){
      push(props.location.query.next || '/projects');
    }
  };

  validateForm = () => {
    const {
      emailError,
      usernameError,
      email,
      emailValid,
      username,
      usernameTooLong,
      usernameTooShort,
      password
    } = this.state;

    const validForm = (email && username && emailValid) && !(emailError || usernameError || usernameTooShort || usernameTooLong);
    return validForm;
  }

  submit = (e) => {
    const { registerUser } = this.props;
    const {
      email,
      username,
      password
    } = this.state;

    const validForm = this.validateForm();
    e.preventDefault();

    if (validForm) {
      registerUser(email, username, password);
    }
  }

  render() {
    const { token, authRequired } = this.props;
    const validForm = this.validateForm();

    if (authRequired) {
      openModal();
    }

    return (
      <DocumentTitle title='DIVE | Activate'>
        <AuthModal
          scrollable
          titleText="Activate DIVE Account"
          isOpen={ true }
          closeAction={ this.closeRegistrationPage }
          className={ styles.registerModal + ' ' + styles.noFooter}
          blackBackground={ true }
          authType='register'
          heading={
            <span>Account Registration</span>
          }
        >
        { !token.confirmed && token.confirming &&
          <Loader text='Confirming token'/>
        }
        { token.confirmed && !token.confirming && token.alreadyActivated &&
          <div>
            <p>{ token.message } <span className={ styles.loginLink } onClick={ this._clickLogin }>Click here to login.</span></p>
          </div>
        }
        { token.confirmed && !token.confirming && !token.alreadyActivated &&
          <div>
            <p>{ token.message } <span className={ styles.loginLink } onClick={ this._clickProjects}>Click here to create a project.</span></p>
          </div>
        }
        { token.error &&
          <div>
            <p>{ token.message } <span className={ styles.registerLink } onClick={ this._clickRegister }>Click here to register.</span></p>
          </div>
        }
        </AuthModal>
      </DocumentTitle>
    );
  }
}

ActivatePage.propTypes = {
  authRequired: React.PropTypes.bool
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    token: user.token
  };
}

export default connect(mapStateToProps, { confirmToken, registerUser, push })(ActivatePage);
