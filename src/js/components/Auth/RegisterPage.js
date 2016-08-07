import React, { Component, PropTypes } from 'react';

import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/AuthActions';

import styles from './Auth.sass';

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
      email: 'usedive@gmail.com',
      username: '',
      password: 'dive',
      confirmPassword: '',
      emailAlreadyTaken: null,
      usernameAlreadyTaken: null,
      usernameTooShort: null,
      usernameTooLong: null,
      emailValid: null,
      emailTaken: null,
      usernameTaken: null,
      passwordMatching: null,
    };

    this.submit = this.submit.bind(this);
  }

  closeRegistrationPage() {
    const { push } = this.props;
    push('/')
  }

  componentWillMount() {
    this.ensureNotLoggedIn(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.ensureNotLoggedIn(nextProps)
  }

  handleEmailChange(e) {
    const email = e.target.value;
    const emailValid = validateEmail(email)
     this.setState({
       email: e.target.value,
       emailValid: emailValid
     });
  }

  handleUsernameChange(e) {
    const username = e.target.value;
    this.setState({ username: username });
    if (username.length < 3) {
      this.setState({ usernameTooShort: true });
    } else if (username.length > 65 ){
      this.setState({ usernameTooLong: true });
    } else {
      this.setState({ usernameTooShort: false });
      this.setState({ usernameTooLong: false });
    }
  }

  handlePasswordChange(e) {
    const password = e.target.value;
    this.setState({ password: e.target.value });
  }

  handleConfirmPasswordChange(e) {
    const confirmPassword = e.target.value;
    const passwordMatching = (confirmPassword == this.state.password)
    this.setState({ passwordMatching: passwordMatching, confirmPassword: confirmPassword});
  }

  _clickLogin() {
    const { push } = this.props;
    push('/login')
  }

  ensureNotLoggedIn(props) {
    const { isAuthenticated, push } = props;

    if (isAuthenticated){
      push(props.location.query.next || '/projects');
    }
  };

  submit() {
    const { registerUser } = this.props;
    const { email, username, password } = this.state;
    registerUser(email, username, password);
  }

  render() {
    const { authRequired, registrationErrors } = this.props;
    const { email, emailValid, username, usernameTooLong, usernameTooShort, password, confirmPassword, passwordMatching } = this.state;
    const disabledRegister = !email || !username || !password || !emailValid || usernameTooShort || usernameTooLong || !passwordMatching;

    if (authRequired) {
      openModal();
    }

    return (
      <DocumentTitle title='DIVE | Register'>
        <AuthModal
          scrollable
          closeAction={ this.closeRegistrationPage.bind(this) }
          className={ styles.registerModal }
          blackBackground={ true }
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

          <form className={ styles.authForm } onSubmit={ this.submit.bind(this) }>
            <div className={ styles.authInputGroup }>
              <Input
                type="text"
                className={ styles.email }
                placeholder="E-mail Address"
                autocomplete="on"
                onChange={ this.handleEmailChange.bind(this) }
                onSubmit={ this.submit }
              />
            </div>

            <div className={ styles.authInputGroup }>
              <Input
                type="text"
                className={ styles.username }
                placeholder="Username"
                autocomplete="on"
                onChange={ this.handleUsernameChange.bind(this) }
                onSubmit={ this.submit }
              />
            </div>

            <div className={ styles.authInputGroup }>
              <Input
                type="password"
                className={ styles.password }
                placeholder="Password"
                onChange={ this.handlePasswordChange.bind(this) }
                onSubmit={ this.submit }
              />
            </div>

            <div className={ styles.authInputGroup }>
              <Input
                type="password"
                className={ styles.password }
                placeholder="Confirm Password"
                onChange={ this.handleConfirmPasswordChange.bind(this) }
                onSubmit={ this.submit }
              />
            </div>
            <RaisedButton
              primary
              className={ styles.submitButton }
              minWidth={ 100 }
              disabled={ disabledRegister }
              onClick={ this.submit }>
              Create your account
            </RaisedButton>
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
  console.log(user.error.register);
  return { registrationErrors: user.error.register, isAuthenticated: user.isAuthenticated };
}

export default connect(mapStateToProps, { registerUser, push })(AuthPage);
