import React, { PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import styles from './app.sass';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import Tabs from '../Base/Tabs';
import Tab from '../Base/Tab';

var Logo = require('babel!svg-react!../../../assets/DIVE_logo_white.svg?name=Logo');

export class App extends BaseComponent {
  constructor(props) {
    super(props);

    this._handleTabsChange = this._handleTabsChange.bind(this);
  }

  _handleTabsChange(tab){
    this.props.pushState(null, `/projects/${this.props.params.projectTitle}/${tab.props.route}`);
  }

  _getSelectedTab(){
    const tabList = ["datasets", "visualizations"];
    const _validTab = function (tabValue) {
      return tabList.indexOf(tabValue) > -1;
    }

    if ((this.props.routes.length > 2) && _validTab(this.props.routes[2].path)) {
      return this.props.routes[2].path;
    } 
    return "datasets";
  }

  render() {
    return (
      <div className={styles.fillContainer}>
        <div className={styles.header}>
          <div className={styles.logoContainer} href="/">
            <Logo className={styles.logo} />
            <div className={styles.logoText}>
              DIVE
            </div>
          </div>
          <Tabs value={this._getSelectedTab()} onChange={this._handleTabsChange.bind(this)}>
            <Tab label="DATASETS" value="datasets" route="datasets" />
            <Tab label="VISUALIZATIONS" value="visualizations" route="visualizations" />
          </Tabs>
        </div>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  pushState: PropTypes.func.isRequired,
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pushState })(App);
