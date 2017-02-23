import React, { Component, PropTypes } from 'react';

import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/AuthActions';

import styles from './Auth.sass';

import { Button, Intent } from '@blueprintjs/core';

import Input from '../Base/Input'
import AuthModal from '../Base/AuthModal';
import RaisedButton from '../Base/RaisedButton';


class UnconfirmedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailAlreadyTaken: null,
      emailValid: null,
      emailTaken: null
    }
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

  closeRegistrationPage = () => {
    const { push } = this.props;
    push('/')
  }

  validateForm = () => {
    const {
      emailError,
      email,
      emailValid
    } = this.state;

    const validForm = email && !emailError;
    return validForm;
  }
  render() {
    const { authRequired } = this.props;
    const {
      emailError,
      email,
      emailValid
    } = this.state;

    if (authRequired) {
      openModal();
    }

    return (
      <DocumentTitle title='DIVE | Unconfirmed'>
        <AuthModal
          scrollable
          titleText='DIVE Account Not Activated'
          isOpen={ true }
          closeAction={ this.closeRegistrationPage }
          className={ styles.registerModal }
          blackBackground={ true }
          authType='register'
          footer = {
            <form className={ styles.authForm + ' ' + styles.activationForm } onSubmit={ this.submit }>
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
              <Button
                className="pt-large pt-fill"
                type="submit"
                text="Resend Activation E-mail"
                intent={ Intent.PRIMARY }
              />
            </form>
          }
        >
          <div>
            <p>Account not activated. Please click the activation link sent to your e-mail.</p>
            <p>To resend your activation e-mail, please enter your e-mail address and click the button below.</p>
          </div>
        </AuthModal>
      </DocumentTitle>
    );
  }
}

UnconfirmedPage.propTypes = {
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

export default connect(mapStateToProps, { registerUser, push })(UnconfirmedPage);
