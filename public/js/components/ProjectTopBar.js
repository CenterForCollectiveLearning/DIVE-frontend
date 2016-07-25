import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset, fetchDatasets } from '../actions/DatasetActions';
import { fetchProjectIfNeeded, createAUID } from '../actions/ProjectActions';
import { logoutUser } from '../actions/AuthActions';
import styles from './App/App.sass';

import DropDownMenu from './Base/DropDownMenu';
import RaisedButton from './Base/RaisedButton';
import Tabs from './Base/Tabs';
import Tab from './Base/Tab';
import TabGroup from './Base/TabGroup';
import ProjectSettingsModal from './ProjectSettingsModal';

import Logo from '../../assets/DIVE_logo_white.svg?name=Logo';

export class ProjectTopBar extends Component {
  constructor(props) {
    super(props);

    this.onSelectProject = this.onSelectProject.bind(this);
    this.onClickProjectSettings = this.onClickProjectSettings.bind(this);
    this.onSelectDataset = this.onSelectDataset.bind(this);

    this.state = {
      projectSettingsModalOpen: false
    };
  }

  onSelectDataset(datasetId) {
    const { gallerySelector, project, push, selectDataset, routes } = this.props;
    const { pathname, query } = location;
    const remainingRoute = routes.slice(3).map((e) => e.path).join('/');
    selectDataset(project.properties.id, datasetId);
    push(`/projects/${ project.properties.id }/datasets/${ datasetId }/${ remainingRoute }`);
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

    const filteredDatasets = datasets.items.filter((d) =>
      (d.id !== datasetSelector.datasetId)
    )

    return (
      <div className={ styles.projectTopBar }>
        { project.properties.title && !project.properties.userProjects &&
          <div className={ styles.projectTopBarLeft}>
            <div className={ styles.section }>
              { ( project.properties.preloaded || projects.userProjects.length == 1) &&
                <div className={ styles.item }>
                  <div className={ styles.label }>Project</div>
                  <div>{ project.properties.title }</div>
                </div>
              }
              { ( !project.properties.preloaded && projects.userProjects.length > 1) &&
                <DropDownMenu
                  className={ styles.projectSelector }
                  valueClassName={ styles.projectSelectorValue }
                  labelClassName={ styles.dropDownLabel }
                  value={ parseInt(project.properties.id) }
                  options={ projects.userProjects }
                  label="Project"
                  valueMember="id"
                  displayTextMember="title"
                  onChange={ this.onSelectProject } />
              }
            </div>
            { datasets.items && datasets.items.length > 0 &&
              <div className={ styles.section }>
                <span className={ styles.separator }>&#9002;</span>
                { datasets.items.length == 1 &&
                  <div className={ styles.item }>
                    <div className={ styles.label }>Dataset</div>
                    <span className={ styles.value }>{ datasetSelector.title }</span>
                  </div>
                }
                { datasets.items.length > 1 &&
                  <DropDownMenu
                    autosize={ true }
                    className={ styles.datasetSelector }
                    valueClassName={ styles.datasetSelectorValue }
                    labelClassName={ styles.dropDownLabel }
                    value={ parseInt(datasetSelector.datasetId) }
                    options={ datasets.items }
                    label="Dataset"
                    valueMember="datasetId"
                    displayTextMember="title"
                    onChange={ this.onSelectDataset.bind(this) } />
                }
              </div>
            }

            <div className={ styles.section }>
              <span className={ styles.separator }>&#9002;</span>
              <div className={ styles.item }>
                <div className={ styles.label }>Mode</div>
                <span className={ styles.value + ' ' + styles.projectPage}>
                  { this._getCurrentPage() }
                </span>
              </div>
            </div>
          </div>
        }
        <div className={ styles.userOptions }>
          <img className={ styles.picture } src="/assets/images/blank_user.png"/>
          <div className={ styles.logoutUser } onClick={ this._logout.bind(this) }>
            Log out of <span className={ styles.username }>{ user.username }</span>
          </div>
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

export default connect(mapStateToProps, {
  push,
  logoutUser,
  fetchDatasets,
  selectDataset,
})(ProjectTopBar);
