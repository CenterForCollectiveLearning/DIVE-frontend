import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectDataset, fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';
import styles from './Analysis.sass';

import Select from 'react-select';
import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';

export class AnalysisSidebar extends Component {
  componentWillReceiveProps(nextProps) {
    const { project, datasets, datasetSelector, fieldProperties, fetchDatasetsIfNeeded, fetchFieldPropertiesIfNeeded } = this.props;

    const projectChanged = (nextProps.project.properties.id !== project.properties.id);
    const datasetChanged = (nextProps.datasetSelector.datasetId !== datasetSelector.datasetId);

    if (projectChanged || nextProps.project.properties.id) {
      fetchDatasetsIfNeeded(nextProps.project.properties.id);
    }
    if (datasetChanged) {
      fetchFieldPropertiesIfNeeded(project.properties.id, nextProps.datasetSelector.datasetId)
    }
  }

  render() {
    const menuItems = this.props.datasets.items.map((dataset, i) =>
      new Object({
        value: dataset.datasetId,
        label: dataset.title
      })
    );

    return (
      <Sidebar>
        { this.props.datasets.items && this.props.datasets.items.length > 0 &&
          <SidebarGroup heading="Dataset">
            <Select
              value={ `${this.props.datasetSelector.datasetId}` }
              options={ menuItems }
              onChange={ this.props.selectDataset }
              multi={ false }
              clearable={ false }
              searchable={ false } />
          </SidebarGroup>
        }
      </Sidebar>
    );
  }
}

AnalysisSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasets, fieldProperties, datasetSelector } = state;
  return {
    project,
    datasets,
    fieldProperties,
    datasetSelector
  };
}

export default connect(mapStateToProps, {
  selectDataset,
  fetchDatasetsIfNeeded,
  fetchFieldPropertiesIfNeeded,
})(AnalysisSidebar);
