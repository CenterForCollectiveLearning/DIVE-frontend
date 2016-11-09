import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetchProjectIfNeeded, createAUID } from '../actions/ProjectActions.js';
import { logoutUser } from '../actions/AuthActions';
import styles from './App/App.sass';

import DropDownMenu from './Base/DropDownMenu';
import RaisedButton from './Base/RaisedButton';
import Tabs from './Base/Tabs';
import Tab from './Base/Tab';
import TabGroup from './Base/TabGroup';
import ProjectSettingsModal from './Base/ProjectSettingsModal';

import Logo from '../../assets/DIVE_logo_white.svg?name=Logo';


export class ProjectSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectSettingsModalOpen: false,
      secondaryNavOpen: false
    };
  }

  _getSelectedTab = () => {
    const tabList = [
      'upload',
      'inspect',
      'transform',
      'explore',
      'starred',
      'aggregation',
      'comparison',
      'correlation',
      'regression',
      'segmentation',
      'timeseries',
      'compose',
      'saved'
    ];

    const _validTab = ((tabValue) =>
      tabList.indexOf(tabValue) > -1
    );

    const _tabValue = ((tabValue) => {
      const splitTabValue = tabValue.split('/');
      return splitTabValue.length > 1 && _validTab(splitTabValue[1]) ? splitTabValue[1] : splitTabValue[0];
    });

    const _lastPath = this.props.routes.slice().reverse().find((route) => {
      return _validTab(_tabValue(route.path));
    });

    if (_lastPath) {
      return _tabValue(_lastPath.path);
    }

    return "datasets";
  }

  _toggleSecondaryNav = () => {
    this.setState({ secondaryNavOpen: !this.state.secondaryNavOpen });
  }

  _handleTabsChange = (tab) => {
    this.props.push(`/projects/${ this.props.project.id }/${ tab.props.route }`);
  }

  _onClickLogo = () =>{
    this.props.push(`/projects`);
  }

  _logout = () => {
    const { logoutUser } = this.props;
    logoutUser();
  }

  onSelectProject = (projectId) => {
    window.location.href = `/projects/${ projectId }/datasets`;
  }

  onClickProjectSettings = () => {
    this.setState({ projectSettingsModalOpen: true });
  }

  closeProjectSettingsModal = () => {
    this.setState({ projectSettingsModalOpen: false });
  }



  render() {
    const { paramDatasetId, user, projects, project, datasets, datasetSelector } = this.props;

    const datasetId = paramDatasetId || datasetSelector.datasetId || (datasets.items.length > 0 && datasets.items[0].datasetId);

    return (
      <div className={ styles.projectSidebar }>
        <div className={ styles.top }>
          <div className={ styles.logoContainer } onClick={ this._onClickLogo }>
            <div className={ styles.logoText }>
              DIVE
            </div>
            <Logo className={ styles.logo } />
          </div>
          <div className={ styles.projectTitle }>{ project.title }</div>
        </div>
        <Tabs value={ this._getSelectedTab() } onChange={ this._handleTabsChange }>
          <TabGroup heading="1. DATASETS">
            <Tab label="Upload" value="upload" route={ `datasets/upload` } />
            <Tab label="Inspect" value="inspect" route={ `datasets${ datasetId ? `/${ datasetId }/inspect` : '/' }` } disabled={ !datasets.items.length }/>
            <Tab label="Transform" value="transform" route={ `datasets${ datasetId ? `/${ datasetId }/transform` : '/combine' }` } disabled={ !datasets.items.length }/>
            <Tab label="Clean" value="clean" route={ `datasets${ datasetId ? `/${ datasetId }/clean` : '/combine' }` } disabled={ true }/>
          </TabGroup>
          <TabGroup heading="2. VISUALIZATIONS">
            <Tab label="Explore" value="explore" route={ `datasets/${ datasetId }/visualize/explore` } disabled={ !datasetId }/>
          </TabGroup>
          <TabGroup heading="3. ANALYSIS">
            <Tab label="Aggregation" value="aggregation" route={ `datasets/${ datasetId }/analyze/aggregation` } disabled={ !datasetId }/>
            <Tab label="Comparison" value="comparison" route={ `datasets/${ datasetId }/analyze/comparison` } disabled={ !datasetId }/>
            <Tab label="Correlation" value="correlation" route={ `datasets/${ datasetId }/analyze/correlation` } disabled={ !datasetId }/>
            <Tab label="Regression" value="regression" route={ `datasets/${ datasetId }/analyze/regression` } disabled={ !datasetId }/>
            <Tab label="Segmentation" value="segmentation" route={ `datasets/${ datasetId }/analyze/segmentation` } disabled={ !datasetId }/>
          </TabGroup>
          <TabGroup heading="4. STORIES">
            <Tab label="Compose" value="compose" route={ `compose` } disabled={ !datasets.items.length }/>
            <Tab label="Saved" value="saved" route={ `compose/saved` } disabled={ true }/>
          </TabGroup>
        </Tabs>
        <div className={ styles.bottom }>
          { this.state.secondaryNavOpen &&
            <div className={ styles.secondaryNav }>
              <div className={ styles.secondaryNavItem } onClick={ this.onClickProjectSettings }>
                Edit Project Properties
              </div>
              <div className={ styles.secondaryNavItem } onClick={ this._logout }>
                Log out of <span className={ styles.username }>{ user.username }</span>
              </div>
              { this.state.projectSettingsModalOpen &&
                <ProjectSettingsModal
                  projectName={ project.title }
                  projectDescription={ project.description }
                  projectId={ project.id }
                  closeAction={ this.closeProjectSettingsModal }/>
              }
            </div>
          }
          <div
            className={
              styles.secondaryNavToggle +
              ( this.state.secondaryNavOpen ? (' ' + styles.secondaryNavOpen) : '')
            }
            onClick={ this._toggleSecondaryNav }
          >
              <span>{ user.username }</span>
              { this.state.secondaryNavOpen ? <span className={ styles.chevron }>&#65088;</span> : <span className={ styles.chevron }>&#65087;</span> }
          </div>
        </div>
      </div>
    );
  }
}

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

export default connect(mapStateToProps, { push, logoutUser })(ProjectSidebar);
