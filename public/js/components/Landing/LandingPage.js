import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import Tabs from '../Base/Tabs';
import Tab from '../Base/Tab';
import UserDropdown from '../Base/UserDropdown';
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

  _logout() {
    const { logoutUser } = this.props;
    logoutUser();
  }

  render() {
    const { user } = this.props;
    return (
      <DocumentTitle title='DIVE / Landing'>
        <div className={ styles.fillContainer + ' ' + styles.landingPage }>
          <div className={ styles.background }>
            <div className={ styles.innerBackground }>
              <div className={ styles.grid }></div>
            </div>
          </div>
          <div className={ styles.landingPageContent }>
            <div className={ styles.header }>
              <div className={ styles.logoContainer } onClick={ this._onClickLogo.bind(this) }>
                <Logo className={ styles.logo } />
                <div className={ styles.logoText }>
                  DIVE
                </div>
              </div>
              <Tabs value={ this._getSelectedTab() } className={ styles.landingTabs } selectedClassName={ styles.selectedTab }>
                <Tab label="PROJECTS" value="/home" route="/home" className={ styles.landingTab } />
                <Tab label="LOG IN" active={ !user.id } value="/login" route="/login" className={ styles.landingTab } />
                <Tab label="REGISTER" active={ !user.id } value="/register" route="/register" className={ styles.landingTab } />
                <Tab label="ABOUT" value="/about" route="/about" className={ styles.landingTab } />
              </Tabs>
              <UserDropdown user={ user }/>
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

export default connect(mapStateToProps, { pushState })(LandingPage);
