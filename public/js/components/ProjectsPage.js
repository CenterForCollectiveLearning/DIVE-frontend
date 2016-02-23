import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { fetchProjectIfNeeded, createAUID } from '../actions/ProjectActions.js';
import styles from './App/App.sass';

import Tabs from './Base/Tabs';
import Tab from './Base/Tab';

var Logo = require('babel!svg-react!../../assets/DIVE_logo_white.svg?name=Logo');

export class ProjectsPage extends Component {
  constructor(props) {
    super(props);

    this._handleTabsChange = this._handleTabsChange.bind(this);
    this._onClickLogo = this._onClickLogo.bind(this);
  }

  componentDidMount() {
    if (this.props.params.projectId) {
      this.props.fetchProjectIfNeeded(this.props.params.projectId);
    }
  }

  _getSelectedTab(){
    const tabList = ["datasets", "transform", "visualize", "analyze", "compose"];
    const _validTab = function (tabValue) {
      return tabList.indexOf(tabValue.split('/')[0]) > -1;
    }

    if ((this.props.routes.length > 2) && _validTab(this.props.routes[2].path)) {
      if ((this.props.routes.length > 3) && _validTab(this.props.routes[3].path)) {
        return this.props.routes[3].path;
      }
      return this.props.routes[2].path;
    }
    return "datasets";
  }

  _handleTabsChange(tab){
    this.props.pushState(null, `/projects/${ this.props.params.projectId }/${ tab.props.route }`);
  }

  _onClickLogo(){
    this.props.pushState(null, `/`);
  }

  render() {
    const { params, datasetSelector } = this.props;

    const datasetId = params.datasetId || datasetSelector.datasetId;

    return (
      <div className={ styles.fillContainer + ' ' + styles.projectContainer }>
        <div className={ styles.header }>
          <div className={ styles.logoContainer } onClick={ this._onClickLogo }>
            <Logo className={ styles.logo } />
            <div className={ styles.logoText }>
              DIVE
            </div>
          </div>
          <Tabs value={ this._getSelectedTab() } onChange={ this._handleTabsChange.bind(this) }>
            <Tab label="DATA" value="datasets" route={ `datasets${ datasetId ? `/${ datasetId }/inspect` : '' }` } />
            <Tab label="VISUALIZE" value="visualize" route={ `datasets/${ datasetId }/visualize/gallery` } disabled={ !datasetId }/>
            <Tab label="ANALYZE" value="analyze" route={ `datasets/${ datasetId }/analyze/regression` } disabled={ !datasetId }/>
            <Tab label="COMPOSE" value="compose" route={ `compose` }/>
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
  const { project, user, datasetSelector } = state;
  return {
    project: project,
    user: user,
    datasetSelector: datasetSelector
  };
}

export default connect(mapStateToProps, { pushState, fetchProjectIfNeeded })(ProjectsPage);
