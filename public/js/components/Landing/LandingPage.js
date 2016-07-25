import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { logoutUser } from '../../actions/AuthActions'

import Link from '../Base/Link';
import HomePage from './HomePage';

export class LandingPage extends Component {
  componentWillMount() {
    const { user, push } = this.props;
    if (user.isAuthenticated) {
      push('/projects')
    }
  }
  _onClickLogo(){
    this.props.push(`/`);
  }

  _getSelectedTab(){
    const tabList = ["/projects", "/about"];
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
          <div className={ styles.landingPageContent + ( this.props.children ? ' ' + styles.landingPageProjects : ' ' + styles.landingPageHome) }>
            <div className={ styles.header }>
              <div className={ styles.logoContainer } onClick={ this._onClickLogo.bind(this) }>
                <div className={ styles.logoText }>
                  DIVE
                </div>
                <img className={ styles.logo } src="../../assets/DIVE_logo_white.svg"/>
              </div>
              <div className={ styles.topRightControls }>
                { user && user.username &&
                  <span>{ user.username }<span className={ styles.separater }> | </span><Link onClick={ this.props.logoutUser }>Sign Out</Link></span>
                }
                { (!user || !user.username) &&
                  <Link route="/login">Log In</Link>
                }
              </div>

            </div>
            <div className={ styles.centeredFill }>
              { this.props.children ||
                <HomePage />
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

export default connect(mapStateToProps, { push, logoutUser })(LandingPage);
