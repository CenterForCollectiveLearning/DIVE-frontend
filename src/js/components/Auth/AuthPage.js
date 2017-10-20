import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import styles from './Auth.sass';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UnconfirmedPage from './UnconfirmedPage';
import ActivatePage from './ActivatePage';
import ResetPasswordEmailPage from './ResetPasswordEmailPage';
import ResetPasswordSubmitPage from './ResetPasswordSubmitPage';

export class AuthPage extends Component {
  render() {
    console.log('In AuthPage', this.props);
    return (
      <div className={ styles.fillContainer + ' ' + styles.appContainer }>
        <Switch>
  	      <Route path={ `${ this.props.match.path }/login` } component={ LoginPage }/>
  	      <Route path={ `${ this.props.match.path }/register` } component={ RegisterPage }/>
  	      <Route path={ `${ this.props.match.path }/activate/:token` } component={ ActivatePage } />
  	      <Route path={ `${ this.props.match.path }/unconfirmed` } component={ UnconfirmedPage }/>
  	      <Route path={ `${ this.props.match.path }/reset` } component={ ResetPasswordEmailPage }/>
  	      <Route path={ `${ this.props.match.path }/reset/:token` } component={ ResetPasswordSubmitPage }/>
	     </Switch>
      </div>
    );
  }
}

AuthPage.propTypes = {
  children: PropTypes.node
};
