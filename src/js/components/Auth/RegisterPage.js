import React, { Component, PropTypes } from 'react';

import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/AuthActions';

import styles from './Auth.sass';

import { Button, Intent, Checkbox } from '@blueprintjs/core';

import Input from '../Base/Input'
import AuthModal from '../Base/AuthModal';
import RaisedButton from '../Base/RaisedButton';

function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

class AuthPage extends Component {
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
    this.ensureNotLoggedIn(this.props)
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

  _clickLogin = () => {
    const { push } = this.props;
    push('/login')
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

    const validForm = (email && username && password && emailValid) && !(emailError || usernameError || usernameTooShort || usernameTooLong);
    return validForm;
  }

  submit = () => {
    const { registerUser } = this.props;
    const {
      email,
      username,
      password
    } = this.state;

    const validForm = this.validateForm();

    if (validForm) {
      registerUser(email, username, password);
    }
  }

  render() {
    const { authRequired } = this.props;
    const {
      emailError,
      usernameError,
      email,
      emailValid,
      username,
      usernameTooLong,
      usernameTooShort,
      password,
      passwordScore,
      passwordFeedbackWarning,
      passwordFeedbackSuggestions
    } = this.state;
    const validForm = this.validateForm();

    if (authRequired) {
      openModal();
    }

    return (
      <DocumentTitle title='DIVE | Register'>
        <AuthModal
          scrollable
          titleText="Register for DIVE"
          isOpen={ true}
          closeAction={ this.closeRegistrationPage }
          className={ styles.registerModal }
          blackBackground={ true }
          heading={
            <span>Account Registration</span>
          }
          footer={
            <div className={ styles.loginText }>
              Already registered? <span className={ styles.loginLink } onClick={ this._clickLogin }>Click here to login</span>.
            </div>
          }>

          <form className={ styles.authForm } >
            <div className={ styles.authInputGroup }>
              { (email && email.length > 3 && !emailValid) &&
                <div className={ styles.authInputError }>Invalid</div>
              }
              { emailError &&
                <div className={ styles.authInputError }>Taken</div>
              }
              <div className="pt-input-group pt-large">
                <input
                  className={ "pt-input pt-large pt-icon-lock pt-fill " + ((emailError || (email && email.length > 3 && !emailValid)) ? 'pt-intent-warning' : '') }
                  placeholder="E-mail Address"
                  autoComplete="on"
                  autoFocus={ true }
                  onChange={ this.handleEmailChange }
                  onSubmit={ this.submit }
                />
                <span className="pt-icon pt-minimal pt-icon-envelope" />
              </div>
            </div>

            <div className={ styles.authInputGroup }>
              { (username && usernameTooShort) && <div className={ styles.authInputError }>Too Short</div> }
              { (username && usernameTooLong) && <div className={ styles.authInputError }>Too Long</div> }
              { usernameError &&
                <div className={ styles.authInputError }>Taken</div>
              }
              <div className="pt-input-group pt-large">
                <input
                  type="text"
                  className={ "pt-input pt-large pt-icon-user pt-fill " + (( usernameError || usernameTooLong || usernameTooShort) ? 'pt-intent-warning' : '')}
                  placeholder="Username"
                  autoComplete="on"
                  onChange={ this.handleUsernameChange }
                  onSubmit={ this.submit }
                />
                <span className="pt-icon pt-minimal pt-icon-user" />
              </div>
            </div>

            <div className={ styles.authInputGroup }>
              { (password && passwordScore <= 1) && <div className={ styles.authInputError + ' ' + styles.weak }>Weak</div> }
              { (password && passwordScore == 2) && <div className={ styles.authInputError + ' ' + styles.good }>Good</div> }
              { (password && passwordScore >= 3) && <div className={ styles.authInputError + ' ' + styles.strong }>Strong</div> }
              <div className="pt-input-group pt-large">
                <input
                  className={ 'pt-input pt-large pt-icon-lock pt-fill ' + ( (password && passwordScore <= 1) ? 'pt-intent-warning' : '') }
                  type="password"
                  placeholder="Password"
                  onChange={ this.handlePasswordChange }
                  onSubmit={ this.submit }
                />
                <span className="pt-icon pt-minimal pt-icon-lock" />
              </div>
            </div>
            <Button
              className="pt-large pt-fill"
              type="submit"
              text="Create Account"
              intent={ Intent.PRIMARY }
              disabled={ !validForm }
              onClick={ this.submit }
            />
          </form>
        </AuthModal>
      </DocumentTitle>
    );
  }
}

AuthPage.propTypes = {
  authRequired: React.PropTypes.bool
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    usernameError: user.error.register.username,
    emailError: user.error.register.email,
    isAuthenticated: user.isAuthenticated
  };
}

export default connect(mapStateToProps, { registerUser, push })(AuthPage);
