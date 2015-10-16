import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { fetchProjectIfNeeded, createAUID } from '../actions/ProjectActions.js';
import styles from './App/app.sass';
import Tabs from './Base/Tabs';
import Tab from './Base/Tab';

var Logo = require('babel!svg-react!../../assets/DIVE_logo_white.svg?name=Logo');

export class ProjectsPage extends Component {
  constructor(props) {
    super(props);

    this._handleTabsChange = this._handleTabsChange.bind(this);
  }

  componentDidMount() {
    if (this.props.params.projectId) {
      this.props.fetchProjectIfNeeded(this.props.params.projectId);
    }
  }

  _getSelectedTab(){
    const tabList = ["data", "transform", "visualize"];
    const _validTab = function (tabValue) {
      return tabList.indexOf(tabValue) > -1;
    }

    if ((this.props.routes.length > 2) && _validTab(this.props.routes[2].path)) {
      return this.props.routes[2].path;
    }
    return "datasets";
  }

  _handleTabsChange(tab){
    this.props.pushState(null, `/projects/${this.props.params.projectId}/${tab.props.route}`);
  }

  render() {
    return (
      <div className={ styles.fillContainer }>
        <div className={ styles.header }>
          <div className={ styles.logoContainer } href="/">
            <Logo className={ styles.logo } />
            <div className={ styles.logoText }>
              DIVE
            </div>
          </div>
          <Tabs value={ this._getSelectedTab() } onChange={ this._handleTabsChange.bind(this) }>
            <Tab label="DATA" value="data" route="data/upload" />
            <Tab label="TRANSFORM" value="transform" route="transform" />
            <Tab label="VISUALIZE" value="visualize" route="visualize/gallery" />
          </Tabs>
        </div>
        {this.props.children}
      </div>
    );
  }
}

ProjectsPage.propTypes = {
  pushState: PropTypes.func.isRequired,
  children: PropTypes.node,
  project: PropTypes.object,
  user: PropTypes.object
};

function mapStateToProps(state) {
  const { project, user } = state;
  return {
    project: project,
    user: user
  };
}

export default connect(mapStateToProps, { pushState, fetchProjectIfNeeded })(ProjectsPage);
