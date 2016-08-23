import React, { Component, PropTypes } from 'react';

import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/AuthActions';

import styles from './Auth.sass';

import Input from '../Base/Input'
import AuthModal from '../Base/AuthModal';
import RaisedButton from '../Base/RaisedButton';

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

class AuthPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      email: '',
      username: '',
      password: '',
      rememberMe: true
    };

    this.goHome = this.goHome.bind(this);
    this.clickRegister = this.clickRegister.bind(this);
    this.closeLoginPage = this.closeLoginPage.bind(this);
    this.handleUsernameOrEmailChange = this.handleUsernameOrEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRememberMeChange = this.handleRememberMeChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.ensureNotLoggedIn(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.ensureNotLoggedIn(nextProps);
  }


  closeLoginPage() {
    const { push } = this.props;
    push('/')
  }

  handleUsernameOrEmailChange(e) {
    const value = e.target.value;
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

  goHome() {
    const { push } = this.props;
    push('/')
  }

  handlePasswordChange(e) {
     this.setState({ password: e.target.value });
  }

  clickRegister() {
    const { push } = this.props;
    push('/register')
  }

  handleRememberMeChange(e) {
    this.setState({ rememberMe: !this.state.rememberMe });
  }

  validateForm() {
    const { email, username, password } = this.state;
    return (( email || username ) && (password && (password != null)))
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      console.log('Handling keypress');
    }
  }

  ensureNotLoggedIn(props) {
    const { isAuthenticated, push } = props;

    if (isAuthenticated){
      push(props.location.query.next || '/projects');
    }
  };

  submit() {
    const { loginUser } = this.props;
    const { email, username, password, rememberMe } = this.state;
    loginUser(email, username, password, rememberMe);
  }

  render() {
    const { authRequired, loginError } = this.props;
    const { email, username, password } = this.state;
    const loginDisabled = !this.validateForm();

    if (authRequired) {
      openModal();
    }

    return (
      <DocumentTitle title='DIVE | Login'>
        <AuthModal
          scrollable
          closeAction={ this.closeLoginPage }
          className={ styles.loginModal }
          blackBackground={ true }
          footer={
            <div className={ styles.registerText }>
              Don&#39;t have an account? <span className={ styles.registerLink } onClick={ this.clickRegister }>Click here to create one</span>.
            </div>
          }>
          <form className={ styles.authForm } >
            <div className={ styles.authInputGroup }>
              <div className={ styles.authInputLabelAndError}>
              </div>
              <Input
                className={ styles.usernameOrEmail }
                type="text"
                placeholder="Username or E-mail"
                autocomplete="on"
                onChange={ this.handleUsernameOrEmailChange }
                onKeyPress={ this.handleKeyPress }
                autofocus={ true }
                onSubmit={ this.submit }
              />
            </div>
            <div className={ styles.authInputGroup }>
              <div className={ styles.authInputLabelAndError}>
              </div>
              <Input
                className={ styles.password }
                type="password"
                placeholder="Password"
                onChange={ this.handlePasswordChange }
                onSubmit={ this.submit }
              />
            </div>
            <div className={ styles.authInputGroup }>
              <div className={ styles.checkbox }>
                <div className={ styles.authInputLabelAndError}>
                  <input
                    type="checkbox"
                    onChange={ this.handleRememberMeChange }
                    checked={ this.state.rememberMe }
                    onSubmit={ this.submit }
                  />
                  <span className={ styles.authInputLabel }>Remember Me</span>
                  <span className={ styles.forgotPassword }>Forgot Password?</span>
                </div>
              </div>
            </div>
            {
              loginError &&
              <div className={ styles.generalAuthError }>{ loginError }</div>
            }
            <RaisedButton
              primary
              className={ styles.submitButton }
              disabled={ loginDisabled }
              onClick={ this.submit }
              minWidth={ 100 }
            >
              Login
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
  return {
    isAuthenticated: user.isAuthenticated,
    loginError: user.error.login
  };
}

export default connect(mapStateToProps, {
  loginUser,
  push
})(AuthPage);
