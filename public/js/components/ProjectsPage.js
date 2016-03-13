import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { fetchProjectIfNeeded, createAUID } from '../actions/ProjectActions.js';
import styles from './App/App.sass';

import Tabs from './Base/Tabs';
import Tab from './Base/Tab';
import TabGroup from './Base/TabGroup';

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
    const tabList = [
      "upload",
      "inspect",
      "combine",
      "explore",
      "build",
      "starred",
      "summary",
      "regression",
      "correlation",
      "compose",
      "saved" 
    ];

    const _validTab = ((tabValue) =>
      tabList.indexOf(tabValue) > -1
    );

    const _tabValue = ((tabValue) => {
      const splitTabValue = tabValue.split('/');
      return splitTabValue.length > 1 ? splitTabValue[1] : splitTabValue[0];
    });

    if ((this.props.routes.length > 3) && _validTab(_tabValue(this.props.routes[3].path))) {
      return _tabValue(this.props.routes[3].path);
    }

    if ((this.props.routes.length > 2) && _validTab(_tabValue(this.props.routes[2].path))) {
      return _tabValue(this.props.routes[2].path);
    }

    return "datasets";
  }

  _handleTabsChange(tab){
    console.log(tab);
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
            <div className={ styles.logoText }>
              DIVE
            </div>
            <Logo className={ styles.logo } />
          </div>
          <Tabs value={ this._getSelectedTab() } onChange={ this._handleTabsChange.bind(this) }>
            <TabGroup heading="DATASETS">
              <Tab label="Upload" value="upload" route={ `datasets/upload` } />
              <Tab label="Inspect" value="inspect" route={ `datasets${ datasetId ? `/${ datasetId }/inspect` : '/inspect' }` } />
              <Tab label="Combine" value="combine" route={ `datasets${ datasetId ? `/${ datasetId }/combine` : '/combine' }` } />
            </TabGroup>
            <TabGroup heading="VISUALIZATIONS">
              <Tab label="Explore" value="explore" route={ `datasets/${ datasetId }/visualize/gallery` } disabled={ !datasetId }/>
              <Tab label="Build" value="build" route={ `datasets/${ datasetId }/visualize/builder` } disabled={ !datasetId }/>
              <Tab label="Starred" value="starred" route={ `datasets/${ datasetId }/visualize/starred` } disabled={ !datasetId }/>
            </TabGroup>
            <TabGroup heading="ANALYSIS">
              <Tab label="Summary" value="summary" route={ `datasets/${ datasetId }/analyze/summary` } disabled={ !datasetId }/>
              <Tab label="Regression" value="regression" route={ `datasets/${ datasetId }/analyze/regression` } disabled={ !datasetId }/>
              <Tab label="Correlation" value="correlation" route={ `datasets/${ datasetId }/analyze/correlation` } disabled={ !datasetId }/>
            </TabGroup>
            <TabGroup heading="STORIES">
              <Tab label="Compose" value="compose" route={ `compose` }/>
              <Tab label="Saved" value="saved" route={ `compose/saved` }/>
            </TabGroup>
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
