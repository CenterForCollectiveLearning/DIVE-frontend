import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchProjectIfNeeded, createAUID } from '../actions/ProjectActions';
import { fetchDatasets } from '../actions/DatasetActions';

import styles from './App/App.sass';

import ProjectSelectionModal from './Base/ProjectSelectionModal';
import DatasetSelectionModal from './Base/DatasetSelectionModal';
import DropDownMenu from './Base/DropDownMenu';
import RaisedButton from './Base/RaisedButton';
import Tabs from './Base/Tabs';
import Tab from './Base/Tab';
import TabGroup from './Base/TabGroup';

import Logo from '../../assets/DIVE_logo_white.svg?name=Logo';

export class ProjectTopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectSelectionModalOpen: false,
      datasetSelectionModalOpen: false
    };
  }

  closeProjectSelectionModal = () => {
    this.setState({ projectSelectionModalOpen: false });
  }

  closeDatasetSelectionModal = () => {
    this.setState({ datasetSelectionModalOpen: false });
  }

  openProjectSelectionModal = () => {
    this.setState({ projectSelectionModalOpen: true });
  }

  openDatasetSelectionModal = () => {
    this.setState({ datasetSelectionModalOpen: true });
  }

  _getCurrentPage = () => {
    const { routes } = this.props;
    const tabList = [
      "upload",
      "preloaded",
      "inspect",
      "transform",
      "explore",
      "starred",
      "aggregation",
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

  render() {
    const { paramDatasetId, user, projects, project, datasets, datasetSelector } = this.props;

    const datasetId = paramDatasetId || datasetSelector.datasetId;

    const filteredDatasets = datasets.items.filter((d) =>
      (d.id !== datasetSelector.datasetId)
    )

    return (
      <div className={ styles.projectTopBar }>
        { project.title && !project.userProjects &&
          <div className={ styles.projectTopBarLeft}>
            <div className={ styles.section }>
              <div className={ styles.item }>
                <div className={ styles.label }>Project</div>
                <span
                  className={ styles.value + ((!project.preloaded && projects.userProjects.length > 1) ? ' ' + styles.multiple : '') }
                  onClick={ this.openProjectSelectionModal }
                >
                  { project.title }
                </span>
              </div>
            </div>
            { datasetSelector.datasetId &&
              <div className={ styles.section }>
                <span className={ styles.separator }>&#9002;</span>
                <div className={ styles.item }>
                  <div className={ styles.label }>Dataset</div>
                  <span
                    className={ styles.value + (datasets.items.length > 1 ?  ' ' + styles.multiple : '')}
                    onClick={ this.openDatasetSelectionModal }
                  >
                    { datasetSelector.title }
                  </span>
                </div>
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
            <ProjectSelectionModal
              isOpen={ this.state.projectSelectionModalOpen }
              closeAction={ this.closeProjectSelectionModal }
              projects={ projects.userProjects }
              onSelect={ this.onSelectProject }
              currentProjectId={ parseInt(project.id) }
            />
            <DatasetSelectionModal
              project={ project }
              isOpen={ this.state.datasetSelectionModalOpen }
              closeAction={ this.closeDatasetSelectionModal }
              datasets={ datasets.items }
              onSelect={ this.onSelectDataset }
              currentDatasetId={ parseInt(datasetSelector.datasetId) }
            />
          </div>
        }
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

export default connect(mapStateToProps, {
  fetchDatasets
})(ProjectTopBar);
