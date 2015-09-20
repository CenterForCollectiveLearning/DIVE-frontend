import React, { PropTypes } from 'react';
import BaseComponent from '../../components/BaseComponent';
import baseStyles from '../../../css/flexbox.sass';
import styles from './App.sass';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { Tabs, Tab } from 'material-ui-io';
import Mui from 'material-ui-io';

var Logo = require('babel!svg-react!../../../assets/DIVE_logo_white.svg?name=Logo');

export class App extends BaseComponent {
  constructor(props) {
    super(props);

    let tabsValue;

    this._handleTabsChange = this._handleTabsChange.bind(this);
    this.state = {tabsValue: this._getSelectedTab()};
  }

  componentWillMount() {
    this.state = {tabsValue: this._getSelectedTab()};
  }

  componentWillReceiveProps(nextProps) {
    this.state = {tabsValue: this._getSelectedTab()};
  }

  _handleTabsChange(value, tab){
    this.props.pushState(null, `/projects/${this.props.params.projectTitle}/${tab.props.route}`);
    this.state = {tabsValue: this._getSelectedTab()};
  }

  _getSelectedTab(){
    const tabList = ["datasets", "visualizations"];
    const _validTab = function (tabValue) {
      return tabList.indexOf(tabValue) > -1;
    }

    if ((this.props.routes.length > 1) && _validTab(this.props.routes[1].path)) {
      return this.props.routes[1].path;
    } 
    return "datasets";
  }

  render() {
    return (
      <div className={baseStyles.fillContainer}>
        <div className={styles.header}>
          <div className={styles.logoContainer} href="/">
            <Logo className={styles.logo} />
            <div className={styles.logoText}>
              DIVE
            </div>
          </div>
          <Tabs value={this.state.tabsValue} onChange={this._handleTabsChange.bind(this)}>
            <Tab label="DATASETS" value="datasets" route="datasets" />
            <Tab label="VISUALIZATIONS" value="visualizations" route="visualizations" />
          </Tabs>
        </div>
        {this.props.children}
      </div>
    );
  }
}

          // <Tabs valueLink={{value: this.state.tabsValue, onChange: this._handleTabsChange.bind(this)}}>
          // <Tabs value={this.state.tabsValue} onChange={this._handleTabsChange.bind(this)}>

App.propTypes = {
  pushState: PropTypes.func.isRequired,
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pushState })(App);
