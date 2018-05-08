import React, { Component, PropTypes } from 'react';

import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { sendResetPasswordSubmit } from '../../actions/AuthActions';

import styles from './Auth.sass';

import { Button, Intent, Checkbox } from '@blueprintjs/core';

import Loader from '../Base/Loader';
import Input from '../Base/Input'
import AuthModal from '../Base/AuthModal';
import RaisedButton from '../Base/RaisedButton';


class ResetPasswordSubmitPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      password: '',
      passwordMatching: null,
      passwordScore: null,
      passwordFeedbackWarning: '',
      passwordFeedbackSuggestions: ''
    };
  }

  closePage = () => {
    const { push } = this.props;
    push('/')
  }

  componentWillMount() {
    const { params } = this.props;
    const { token } = params;
    this.ensureNotLoggedIn(this.props)
    this.setState({ token: token });
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

  _clickProjects = () => { this.props.push('/projects'); }
  _clickLogin = () => { this.props.push('/auth/login'); }
  _clickRegister = () => { this.props.push('/auth/register'); }
  _clickResetPasswordEmailPage = () => { console.log('pressing'); this.props.push('/auth/reset'); }

  ensureNotLoggedIn(props) {
    const { isAuthenticated, push } = props;

    if (isAuthenticated){
      push(props.location.query.next || '/projects');
    }
  };

  validateForm = () => {
    const { password } = this.state;

    const validForm = password
    return validForm;
  }

  submit = (e) => {
    const { registerUser, sendResetPasswordSubmit } = this.props;
    const { token, password } = this.state;

    const validForm = this.validateForm();
    e.preventDefault();

    console.log('Submit', validForm);
    if (validForm) {
      sendResetPasswordSubmit(token, password);
    }
  }

  render() {
    const { token, authRequired, resetPasswordSubmit } = this.props;
    const {
      password,
      passwordScore,
      passwordFeedbackWarning,
      passwordFeedbackSuggestions
    } = this.state;
    const validForm = this.validateForm();

    return (
      <DocumentTitle title='DIVE | Activate'>
        <AuthModal
          scrollable
          titleText="Reset DIVE Password"
          isOpen={ true }
          closeAction={ this.closePage }
          className={ styles.registerModal + ' ' + styles.noFooter }
          blackBackground={ true }
          iconName='lock'
        >
          { resetPasswordSubmit.error &&
            <div>
              <p>{ resetPasswordSubmit.message } <span className={ styles.loginLink } onClick={ this._clickResetPasswordEmailPage }>Click here to resend another reset e-mail.</span></p>
            </div>
          }
          { resetPasswordSubmit.reset &&
            <div>
              <p>{ resetPasswordSubmit.message } <span className={ styles.loginLink } onClick={ this._clickLogin }>Click here to login.</span></p>
            </div>
          }
          { !resetPasswordSubmit.error && !resetPasswordSubmit.reset &&
            <form className={ styles.authForm + ' ' + styles.activationForm } onSubmit={ this.submit }>
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
                  />
                  <span className="pt-icon pt-minimal pt-icon-lock" />
                </div>
              </div>
              <Button
                className="pt-large pt-fill"
                type="submit"
                text={ resetPasswordSubmit.reset ? 'Password Reset!' : 'Reset Password' }
                intent={ Intent.PRIMARY }
                disabled={ !validForm || resetPasswordSubmit.sent }
                onClick={ this.submit }
                loading={ resetPasswordSubmit.isResetting }
              />
            </form>
          }
        </AuthModal>
      </DocumentTitle>
    );
  }
}

ResetPasswordSubmitPage.propTypes = {
  authRequired: React.PropTypes.bool
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    resetPasswordSubmit: user.resetPasswordSubmit,
    token: user.token
  };
}

export default connect(mapStateToProps, { sendResetPasswordSubmit, push })(ResetPasswordSubmitPage);
