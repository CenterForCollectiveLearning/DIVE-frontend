import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded, selectFieldProperty, selectAggregationFunction } from '../../actions/FieldPropertiesActions';
import { selectDataset, selectVisualizationType } from '../../actions/VisualizationActions';
import styles from './visualizations.sass';

import Select from 'react-select';
import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';

export class GallerySidebar extends Component {
  componentWillReceiveProps(nextProps) {
    const { project, datasets, specSelector, fieldProperties, fetchDatasetsIfNeeded, fetchFieldPropertiesIfNeeded, selectDataset } = this.props;

    const projectChanged = (nextProps.project.properties.id !== project.properties.id);
    const datasetChanged = (nextProps.specSelector.datasetId !== specSelector.datasetId);

    if (projectChanged || (nextProps.project.properties.id && !specSelector.datasetId)) {
      fetchDatasetsIfNeeded(nextProps.project.properties.id);
    }
    if (datasetChanged) {
      fetchFieldPropertiesIfNeeded(project.properties.id, nextProps.specSelector.datasetId)
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
              value={ `${this.props.specSelector.datasetId}` }
              options={ menuItems }
              onChange={ this.props.selectDataset }
              multi={ false }
              clearable={ false }
              searchable={ false } />
          </SidebarGroup>
        }
        { this.props.datasets.items && this.props.datasets.items.length > 0 &&
          <SidebarGroup heading="Visualization type">
            <ToggleButtonGroup
              toggleItems={ this.props.filters.visualizationTypes }
              displayTextMember="label"
              valueMember="type"
              imageNameMember="imageName"
              imageNameSuffix=".chart.svg"
              onChange={ this.props.selectVisualizationType } />
          </SidebarGroup>
        }
        { this.props.fieldProperties.items.length > 0 &&
          <SidebarGroup heading="Fields">
            <ToggleButtonGroup
              toggleItems={ this.props.fieldProperties.items }
              displayTextMember="name"
              valueMember="id"
              selectMenuItem={ this.props.selectAggregationFunction }
              onChange={ this.props.selectFieldProperty } />
          </SidebarGroup>
        }
      </Sidebar>
    );
  }
}

GallerySidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  specSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasets, specSelector, fieldProperties, filters } = state;
  return {
    project,
    datasets,
    specSelector,
    fieldProperties,
    filters
  };
}

export default connect(mapStateToProps, {
  fetchDatasetsIfNeeded,
  fetchFieldPropertiesIfNeeded,
  selectDataset,
  selectVisualizationType,
  selectFieldProperty,
  selectAggregationFunction
})(GallerySidebar);
