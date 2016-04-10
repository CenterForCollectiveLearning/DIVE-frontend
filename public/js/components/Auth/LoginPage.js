import React, { Component, PropTypes } from 'react';

import { pushState } from 'redux-react-router';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/AuthActions';

import styles from './Auth.sass';

import Input from '../Base/Input'
import BlockingModal from '../Base/BlockingModal';
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
      email: 'usedive@gmail.com',
      username: '',
      password: 'dive',
      rememberMe: true
    };
  }

  closeLoginPage() {
    const { pushState } = this.props;
    pushState(null, '/home')
  }

  componentWillMount() {
    this.ensureNotLoggedIn(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.ensureNotLoggedIn(nextProps)
  }

  handleUsernameOrEmailChange(e) {
    const input = e.target.value;
    const isEmailInput = validateEmail(input);

    if (isEmailInput) {
      this.setState({
        username: '',
        email: input
      });
    } else {
      this.setState({
        username: input,
        email: ''
      });
    }
  }

  handlePasswordChange(e) {
     this.setState({ password: e.target.value });
  }

  _clickRegister() {
    const { pushState } = this.props;
    pushState(null, '/register')
  }

  _handleRememberMeChange(e) {
    this.setState({ rememberMe: !this.state.rememberMe });
  }

  ensureNotLoggedIn(props) {
    const { isAuthenticated, pushState } = props;

    if (isAuthenticated){
      pushState(null, props.location.query.next || '/home');
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
    const loginDisabled = ( !email && !username ) || (!password || password == null)

    if (authRequired) {
      openModal();
    }

    return (
      <DocumentTitle title='DIVE | Login'>
        <BlockingModal
          scrollable
          closeAction={ this.closeLoginPage.bind(this) }
          className={ styles.loginModal }
          heading={
            <span>Login or Register to Proceed</span>
          }
          footer={
            <div className={ styles.footerContent }>
              <div className={ styles.registerText }>
                Dont have an account? <span className={ styles.registerLink } onClick={ this._clickRegister.bind(this) }>Click here to create one</span>.
              </div>
            </div>
          }>
          <form className={ styles.authForm } onSubmit={ this.submit.bind(this) } >
            <div className={ styles.authInputGroup }>
              <div className={ styles.authInputLabelAndError}>
                <div className={ styles.authInputLabel }>Username or E-mail</div>
                { loginError &&
                  <div className={ styles.error }>
                    { loginError }
                  </div>
                }
              </div>
              <Input
                type="text"
                placeholder="diveuser"
                autocomplete="on"
                onChange={ this.handleUsernameOrEmailChange.bind(this) }
              />
            </div>
            <div className={ styles.authInputGroup }>
              <div className={ styles.authInputLabelAndError}>
                <div className={ styles.authInputLabel }>Password</div>
              </div>
              <Input
                type="password"
                placeholder="Password"
                onChange={ this.handlePasswordChange.bind(this) }
              />
            </div>
            <div className={ styles.authInputGroup }>
              <div className={ styles.checkbox }>
                <div className={ styles.authInputLabelAndError}>
                  <div className={ styles.authInputLabel }>Remember Me</div>
                  <input
                    type="checkbox"
                    onChange={ this._handleRememberMeChange.bind(this) }
                    checked={ this.state.rememberMe }
                  />
                </div>
              </div>
            </div>
            <RaisedButton
              primary
              disabled={ loginDisabled }
              className={ styles.submit }
              minWidth={ 100 }
              onClick={ this.submit.bind(this) }
            >
              Login
            </RaisedButton>
          </form>

        </BlockingModal>
      </DocumentTitle>
    );
  }
}

AuthPage.propTypes = {
  authRequired: React.PropTypes.bool
};

function mapStateToProps(state) {
  const { user } = state;
  return { isAuthenticated: user.isAuthenticated, loginError: user.error.login };
}

export default connect(mapStateToProps, { loginUser, pushState})(AuthPage);
