import React, { Component, PropTypes } from 'react';
import styles from './landing.sass';
import { connect } from 'react-redux';
import { fetchProjectIfNeeded, createAUID } from '../../actions/ProjectActions.js';

import RaisedButton from '../Base/RaisedButton';
import Dropzone from 'react-dropzone';

import Tabs from '../Base/Tabs';
import Tab from '../Base/Tab';

var Logo = require('babel!svg-react!../../../assets/DIVE_logo_white.svg?name=Logo');

export class LandingPage extends Component {

  constructor(props) {
    super(props);

    this._handleTabsChange = this._handleTabsChange.bind(this);
  }

  _handleTabsChange(tab){
    this.props.pushState(null, `/${tab.props.route}`);
  }

  _getSelectedTab(){
    const tabList = ["team", "about", "login"];
    const _validTab = function (tabValue) {
      return tabList.indexOf(tabValue) > -1;
    }

    if ((this.props.routes.length > 2) && _validTab(this.props.routes[2].path)) {
      return this.props.routes[2].path;
    }
    return "team";
  }

  render() {
    return (
      <div className={styles.fillContainer + ' ' + styles.background}>
        <div className={styles.fillContainer + ' ' + styles.grid}>
          <div className={styles.top}>
            <div className={styles.header}>
              <div className={styles.logoContainer} href="/">
                <Logo className={styles.logo} />
                <div className={styles.logoText}>
                  DIVE
                </div>
              </div>
              <Tabs value={this._getSelectedTab()} onChange={this._handleTabsChange.bind(this)} style={styles.landingTabs}>
                <Tab label="LOGIN" value="login" route="login" />
                <Tab label="TEAM" value="team" route="team" />
                <Tab label="ABOUT" value="about" route="about" />
              </Tabs>
            </div>
            <div className={styles.primaryText}>
              Stop Processing Data and Start Understanding It
            </div>
            <div className={styles.secondaryText}>
              Merge and query datasets, conduct statistical analyses, and explore
              automatically generated visualizations within seconds.
            </div>
            <RaisedButton label="Select & upload a file" primary={ true } onClick={ this.onOpenClick } className={styles.uploadButton} />
          </div>
          <div className={styles.separator}></div>
          <div className={styles.preloaded}>
            <div className={styles.header}>Or explore our preloaded projects:</div>
          </div>
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { fetchProjectIfNeeded })(LandingPage);
