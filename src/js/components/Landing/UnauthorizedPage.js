import React, { Component, PropTypes } from 'react';
import styles from './UnauthorizedPage.sass';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Link from '../Base/Link';
import Footer from './Footer';
import HomePage from './HomePage';
import { wipeProjectState } from '../../actions/ProjectActions';

import { Position, Toaster, Button, Intent, NonIdealState } from '@blueprintjs/core';

import Logo from '../../../assets/DIVE_logo_white.svg?name=Logo';

export class UnauthorizedPage extends Component {
  goHome = () => {
    this.props.push(`/`);
  }

  render() {
    const { user } = this.props;
    return (
      <DocumentTitle title='DIVE | Error'>
        <div className={ styles.fillContainer + ' ' + styles.unauthorizedPage }>
          <nav className={ 'pt-navbar pt-dark pt-fixed-top ' + styles.header + ' ' + styles.opaque }>
            <div className="pt-navbar-group pt-align-left">
              <div className={ 'pt-navbar-heading ' + styles.logoContainer } onClick={ this.goHome }>
                <Logo className={ styles.logo } />
                <div className={ styles.logoText }>DIVE</div>
              </div>
            </div>
            <div className="pt-navbar-group pt-align-right">
              { (user.id && !user.anonymous) &&
                <div className={ styles.rightButtons }>
                  <Link className="pt-button pt-minimal pt-icon-projects" route="/projects">Projects</Link>
                  <span className="pt-navbar-divider"></span>
                  <div className="pt-button pt-minimal pt-icon-log-out" onClick={ this.props.logoutUser }>Log Out of { user.username }</div>
                </div>
              }
              { (user.anonymous || !user.id) &&
                <div className={ styles.rightButtons }>
                  <Link className="pt-button pt-minimal pt-icon-log-in" route="/auth/login">Log In</Link>
                  <Link className="pt-button pt-minimal pt-icon-user" route="/auth/register">Register</Link>
                </div>
              }
            </div>
          </nav>
          <NonIdealState
            className={ styles.centeredFill + ' ' + styles.unauthorizedPageContent }
            title='Not Authorized'
            description={ <p>You are not authorized to view this resource.</p> }
            action={ <span className={ styles.link } onClick={ this.goHome }>Click here to return to DIVE.</span> }
            visual='lock'
          />
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps, { push })(UnauthorizedPage);
