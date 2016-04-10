import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { logoutUser } from '../../actions/AuthActions'

import Link from '../Base/Link';
import FeaturesPage from './FeaturesPage';

var Logo = require('babel!svg-react!../../../assets/DIVE_logo_white.svg?name=Logo');

export class LandingPage extends Component {
  _onClickLogo(){
    this.props.pushState(null, `/`);
  }

  _getSelectedTab(){
    const tabList = ["/home", "/about"];
    const _validTab = function (tabValue) {
      return tabList.indexOf(tabValue) > -1;
    }

    if ((this.props.routes.length > 2) && _validTab(this.props.routes[2].path)) {
      return this.props.routes[2].path;
    }
    return "";
  }

  render() {
    const { user } = this.props;
    return (
      <DocumentTitle title='DIVE | Landing'>
        <div className={ styles.fillContainer + ' ' + styles.landingPage }>
          <div className={ styles.background }>
          </div>
          <div className={ styles.landingPageContent }>
            <div className={ styles.header }>
              <div className={ styles.logoContainer } onClick={ this._onClickLogo.bind(this) }>
                <div className={ styles.logoText }>
                  DIVE
                </div>
                <Logo className={ styles.logo } />
              </div>
              <div className={ styles.topRightControls }>
                { user && user.username &&
                  <span>{ user.username }<span className={ styles.separater }> | </span><Link onClick={ this.props.logoutUser }>Sign out</Link></span>
                }
                { (!user || !user.username) &&
                  <Link route="/login">Sign in</Link>
                }
              </div>
            </div>
            <div className={ styles.centeredFill }>
              { this.props.children ||
                <FeaturesPage />
              }
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

LandingPage.propTypes = {
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps, { pushState, logoutUser })(LandingPage);
