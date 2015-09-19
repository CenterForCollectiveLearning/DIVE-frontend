import React, { PropTypes } from 'react';
import BaseComponent from '../components/BaseComponent';
import Datasets from '../components/Datasets';
import styles from '../../css/app.css';
import { fetchProjectIfNeeded, fetchDatasetsIfNeeded } from '../actions/ProjectActions.js';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { Tabs, Tab } from 'material-ui-io';

var Logo = require('babel!svg-react!../../assets/DIVE_logo_white.svg?name=Logo');

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

  componentDidMount() {
    this.props.fetchProjectIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    this.state = {tabsValue: this._getSelectedTab()};
  }

  _handleTabsChange(value, tab){
    this.props.pushState(null, `/${tab.props.route}`);
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
    const { project } = this.props;
    return (
      <div className={styles.app}>
        <div className={styles.header}>
          <div className={styles.logoContainer} href="/">
            <Logo className={styles.logo} />
            <div className={styles.logoText}>
              DIVE
            </div>
          </div>
          <Tabs value={this.state.tabsValue} onChange={this._handleTabsChange.bind(this)}>
            <Tab className={styles.tab} label="Datasets" value="datasets" route="datasets" />
            <Tab className={styles.tab} label="Visualizations" value="visualizations" route="visualizations" />
          </Tabs>
        </div>
        <div className={styles.mainView}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

          // <Tabs valueLink={{value: this.state.tabsValue, onChange: this._handleTabsChange.bind(this)}}>
          // <Tabs value={this.state.tabsValue} onChange={this._handleTabsChange.bind(this)}>

App.propTypes = {
  datasets: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  pushState: PropTypes.func.isRequired,
  children: PropTypes.node
};

export class Child extends BaseComponent {
  render() {
    return (
      <div>
        <h2>Child</h2>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets } = state;
  return {
    project,
    datasets
  };
}

export default connect(mapStateToProps, { pushState, fetchProjectIfNeeded, fetchDatasetsIfNeeded })(App);
