import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetchProjectIfNeeded, createAUID, logoutUser } from '../actions/ProjectActions.js';
import styles from './App/App.sass';

import DropDownMenu from './Base/DropDownMenu';
import RaisedButton from './Base/RaisedButton';
import Tabs from './Base/Tabs';
import Tab from './Base/Tab';
import TabGroup from './Base/TabGroup';
import ProjectSettingsModal from './ProjectSettingsModal';

var Logo = require('babel!svg-react!../../assets/DIVE_logo_white.svg?name=Logo');

export class ProjectTopBar extends Component {
  constructor(props) {
    super(props);

    this.onSelectProject = this.onSelectProject.bind(this);
    this.onClickProjectSettings = this.onClickProjectSettings.bind(this);

    this.state = {
      projectSettingsModalOpen: false
    };
  }

  _getCurrentPage(){
    const { routes } = this.props;
    const tabList = [
      "upload",
      "inspect",
      "transform",
      "explore",
      "builder",
      "starred",
      "summary",
      "comparison",
      "correlation",
      "regression",
      "compose",
      "saved"
    ];

    const _validTab = ((tabValue) =>
      tabList.indexOf(tabValue) > -1
    );

    const _tabValue = ((tabValue) => {
      const splitTabValue = tabValue.split('/');
      return splitTabValue.length > 1 && _validTab(splitTabValue[1]) ? splitTabValue[1] : splitTabValue[0];
    });

    const _lastPath = routes.slice().reverse().find((route) =>{
      return _validTab(_tabValue(route.path));
    });

    if (_lastPath) {
      return _tabValue(_lastPath.path);
    }
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
      <div className={ styles.projectTopBar }>
        { project.properties.title && !project.properties.preloaded &&
          <div className={ styles.projectTopBarLeft}>
            <span className={ styles.projectTitle }>
              { project.properties.title }
            </span>
            <span className={ styles.separator }>/</span>
            <span className={ styles.projectCurrentPage }>
              { this._getCurrentPage() }
            </span>
          </div>
        }
        <div className={ styles.logoutUser } onClick={ this._logout.bind(this) }>
          Log out of <span className={ styles.username }>{ user.username }</span>
        </div>
        { this.state.projectSettingsModalOpen &&
          <ProjectSettingsModal
            projectName={ project.properties.title }
            projectDescription={ project.properties.description }
            projectId={ project.properties.id }
            closeAction={ this.closeProjectSettingsModal.bind(this) }/>
        }
      </div>
    );
  }
}

ProjectTopBar.propTypes = {
  paramDatasetId: PropTypes.string,
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

export default connect(mapStateToProps, { push, logoutUser })(ProjectTopBar);
