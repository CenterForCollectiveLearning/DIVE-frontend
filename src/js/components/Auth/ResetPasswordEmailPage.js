import React, { Component, PropTypes } from 'react';

import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { sendResetPasswordEmail } from '../../actions/AuthActions';
import { validateEmail } from '../../helpers/auth';

import styles from './Auth.sass';

import { Button, Intent } from '@blueprintjs/core';

import Input from '../Base/Input'
import AuthModal from '../Base/AuthModal';
import RaisedButton from '../Base/RaisedButton';


class ResetPasswordEmailPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailAlreadyTaken: null,
      emailValid: null,
      emailTaken: null
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      emailError: nextProps.emailError,
    });
  }

  sanitizeBackendErrors = () => {
    this.setState({
      emailError: null
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

    const validForm = email && emailValid && !emailError;
    return validForm;
  }

  submit = (e) => {
    const { sendResetPasswordEmail } = this.props;
    const {
      email
    } = this.state;

    const validForm = this.validateForm();
    e.preventDefault();

    if (validForm) {
      sendResetPasswordEmail(email);
    }
  }

  render() {
    const { resetPasswordEmail } = this.props;
    const {
      emailError,
      email,
      emailValid
    } = this.state;
    const validForm = this.validateForm();

    return (
      <DocumentTitle title='DIVE | Forgot Password'>
        <AuthModal
          scrollable
          titleText="Send Password Reset E-mail"
          isOpen={ true }
          closeAction={ this.closeRegistrationPage }
          className={ styles.registerModal }
          blackBackground={ true }
          iconName='lock'
          footer = {
            <form className={ styles.authForm + ' ' + styles.activationForm } onSubmit={ this.submit }>
              <div className={ styles.authInputGroup }>
                { (email && email.length > 3 && !emailValid) &&
                  <div className={ styles.authInputError }>Invalid</div>
                }
                { emailError &&
                  <div className={ styles.authInputError }>Invalid</div>
                }
                <div className="pt-input-group pt-large">
                  <input
                    className={ "pt-input pt-large pt-icon-lock pt-fill " + ((emailError || (email && email.length > 3 && !emailValid)) ? 'pt-intent-warning' : '') }
                    placeholder="E-mail Address"
                    autoComplete="on"
                    autoFocus={ true }
                    onChange={ this.handleEmailChange }
                    onSubmit={ this.submit }
                    disabled={ resetPasswordEmail.sent }
                  />
                  <span className="pt-icon pt-minimal pt-icon-envelope" />
                </div>
              </div>
              <Button
                className="pt-large pt-fill"
                type="submit"
                text={ resetPasswordEmail.sent ? 'E-mail Sent!' : 'Send Password Reset Link' }
                intent={ Intent.PRIMARY }
                disabled={ !validForm || resetPasswordEmail.sent }
                onClick={ this.submit }
                loading={ resetPasswordEmail.isSending }
              />
            </form>
          }
        >
          <div>
            <p>To reset your password, please enter your e-mail address and click the button below to receive a link with instructions.</p>
          </div>
        </AuthModal>
      </DocumentTitle>
    );
  }
}

ResetPasswordEmailPage.propTypes = {
  authRequired: React.PropTypes.bool
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    resetPasswordEmail: user.resetPasswordEmail,
    emailError: user.resetPasswordEmail.error,
    isAuthenticated: user.isAuthenticated
  };
}

export default connect(mapStateToProps, { sendResetPasswordEmail, push })(ResetPasswordEmailPage);
