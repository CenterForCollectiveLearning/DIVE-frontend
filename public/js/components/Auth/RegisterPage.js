import React, { Component, PropTypes } from 'react';

import { pushState } from 'redux-react-router';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/AuthActions';

import styles from './Auth.sass';

import Input from '../Base/Input'
import BlockingModal from '../Base/BlockingModal';
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
      emailValid: null,
      emailTaken: null,
      usernameTaken: null,
      passwordMatching: null,
    };
  }

  closeRegistrationPage() {
    const { pushState } = this.props;
    pushState(null, '/home')
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
     this.setState({ username: e.target.value });
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
    const { registerUser } = this.props;
    const { email, username, password } = this.state;
    registerUser(email, username, password);
  }

  render() {
    const { authRequired } = this.props;
    const { email, emailValid, password, confirmPassword, passwordMatching } = this.state;

    if (authRequired) {
      openModal();
    }

    return (
      <BlockingModal
        scrollable
        closeAction={ this.closeRegistrationPage.bind(this) }
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
        <div>
          <div>email: { email }</div>
          <div>emailValid: { emailValid }</div>
          <div>password: { password }</div>
          <div>confirmPassword: { confirmPassword }</div>
          <div>passwordMatching: { passwordMatching }</div>
        </div>
        <form className={ styles.authForm }>
          <div className={ styles.authInputGroup }>
            <div className={ styles.authInputLabel }>E-mail</div>
            { (email && emailValid != null && !emailValid) &&
              <div className={ styles.error }>
                Please enter a valid e-mail
              </div>
            }
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
              placeholder="P4ssword1?"
              onChange={this.handlePasswordChange.bind(this)}
            />
          </div>

          <div className={ styles.authInputGroup }>
            <div className={ styles.authInputLabel }>Confirm Password</div>
            { (confirmPassword && passwordMatching != null && !passwordMatching) &&
              <div className={ styles.error }>
                Passwords do not match
              </div>
            }
            <Input
              type="password"
              placeholder="P4ssword1?"
              onChange={this.handleConfirmPasswordChange.bind(this)}
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

export default connect(mapStateToProps, { registerUser, pushState})(AuthPage);
