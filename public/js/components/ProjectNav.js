import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { fetchProjectIfNeeded, createAUID, logoutUser } from '../actions/ProjectActions.js';
import styles from './App/App.sass';

import DropDownMenu from './Base/DropDownMenu';
import RaisedButton from './Base/RaisedButton';
import Tabs from './Base/Tabs';
import Tab from './Base/Tab';
import TabGroup from './Base/TabGroup';
import ProjectSettingsModal from './ProjectSettingsModal';

var Logo = require('babel!svg-react!../../assets/DIVE_logo_white.svg?name=Logo');

export class ProjectNav extends Component {
  constructor(props) {
    super(props);

    this._handleTabsChange = this._handleTabsChange.bind(this);
    this._onClickLogo = this._onClickLogo.bind(this);
    this.onSelectProject = this.onSelectProject.bind(this);
    this.onClickProjectSettings = this.onClickProjectSettings.bind(this);

    this.state = {
      projectSettingsModalOpen: false
    };
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
    this.props.pushState(null, `/projects/${ this.props.params.projectId }/${ tab.props.route }`);
  }

  _onClickLogo(){
    this.props.pushState(null, `/home`);
  }

  _logout() {
    const { logoutUser } = this.props;
    logoutUser();
  }

  onSelectProject(projectId) {
    window.location.href = `/projects/${ projectId }/datasets`;
  }

  onClickProjectSettings() {
    this.setState({ projectSettingsModalOpen: true });
  }

  closeProjectSettingsModal() {
    this.setState({ projectSettingsModalOpen: false });
  }

  render() {
    const { paramDatasetId, user, projects, project, datasets, datasetSelector } = this.props;

    const datasetId = paramDatasetId || datasetSelector.datasetId;

    return (
      <div className={ styles.header }>
        <div className={ styles.logoContainer } onClick={ this._onClickLogo }>
          <div className={ styles.logoText }>
            DIVE
          </div>
          <Logo className={ styles.logo } />
        </div>
        { !project.properties.preloaded &&
          <div className={ styles.projectSelectorContainer }>
            <DropDownMenu
              className={ styles.projectSelector }
              valueClassName={ styles.projectSelectorValue }
              value={ parseInt(project.properties.id) }
              options={ projects.userProjects.length > 0 ? projects.userProjects : [] }
              valueMember="id"
              displayTextMember="title"
              onChange={ this.onSelectProject } />
            <RaisedButton
              className={ styles.projectSelectorAction }
              icon
              altText="Project settings"
              onClick={ this.onClickProjectSettings }>
              <i className="fa fa-cog"></i>
            </RaisedButton>
          </div>
        }
        <Tabs value={ this._getSelectedTab() } onChange={ this._handleTabsChange.bind(this) }>
          <TabGroup heading="DATASETS">
            <Tab label="Upload" value="upload" route={ `datasets/upload` } />
            <Tab label="Inspect" value="inspect" route={ `datasets${ datasetId ? `/${ datasetId }/inspect` : '/' }` } disabled={ !datasets.items.length }/>
            <Tab label="Combine" value="combine" route={ `datasets${ datasetId ? `/${ datasetId }/combine` : '/combine' }` } disabled={ true }/>
          </TabGroup>
          <TabGroup heading="VISUALIZATIONS">
            <Tab label="Explore" value="explore" route={ `datasets/${ datasetId }/visualize/gallery` } disabled={ !datasetId }/>
            <Tab label="Build" value="build" route={ `datasets/${ datasetId }/visualize/builder` } disabled={ true }/>
            <Tab label="Starred" value="starred" route={ `datasets/${ datasetId }/visualize/starred` } disabled={ true }/>
          </TabGroup>
          <TabGroup heading="ANALYSIS">
            <Tab label="Summary" value="summary" route={ `datasets/${ datasetId }/analyze/summary` } disabled={ !datasetId }/>
            <Tab label="Regression" value="regression" route={ `datasets/${ datasetId }/analyze/regression` } disabled={ !datasetId }/>
            <Tab label="Correlation" value="correlation" route={ `datasets/${ datasetId }/analyze/correlation` } disabled={ !datasetId }/>
          </TabGroup>
          <TabGroup heading="STORIES">
            <Tab label="Compose" value="compose" route={ `compose` } disabled={ !datasets.items.length }/>
            <Tab label="Saved" value="saved" route={ `compose/saved` } disabled={ true }/>
          </TabGroup>
        </Tabs>
        <div className={ styles.logoutUser } onClick={ this._logout.bind(this) }>
          Log out of <span className={ styles.username }>{ user.username }</span>
        </div>
        { this.state.projectSettingsModalOpen &&
          <ProjectSettingsModal
            projectName={ project.properties.title }
            projectId={ project.properties.id }
            closeAction={ this.closeProjectSettingsModal.bind(this) }/>
        }
      </div>
    );
  }
}

ProjectNav.propTypes = {
  paramDatasetId: PropTypes.string,
  pushState: PropTypes.func.isRequired,
  project: PropTypes.object,
  projects: PropTypes.object,
  user: PropTypes.object,
  datasetSelector: PropTypes.object,
  routes: PropTypes.array
};

function mapStateToProps(state) {
  const { project, projects, user, datasets, datasetSelector } = state;
  return {
    project,
    projects,
    user,
    datasets,
    datasetSelector
  };
}

export default connect(mapStateToProps, { pushState, logoutUser })(ProjectNav);
