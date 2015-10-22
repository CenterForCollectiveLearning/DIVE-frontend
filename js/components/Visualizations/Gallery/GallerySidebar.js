import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectDataset, fetchDatasetsIfNeeded } from '../../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded, selectFieldProperty, selectAggregationFunction } from '../../../actions/FieldPropertiesActions';
import { selectVisualizationType } from '../../../actions/VisualizationActions';
import styles from '../Visualizations.sass';

import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class GallerySidebar extends Component {
  componentWillMount() {
    const { project, datasetSelector, fieldProperties, fetchDatasetsIfNeeded, fetchFieldPropertiesIfNeeded, selectDataset } = this.props;

    if (project.properties.id && !datasetSelector.datasetId && !datasetSelector.isFetching) {
      fetchDatasetsIfNeeded(project.properties.id);
    }
    if (datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.isFetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId);
    }
  }

  componentDidUpdate(previousProps) {
    const { project, datasetSelector, fieldProperties, fetchDatasetsIfNeeded, fetchFieldPropertiesIfNeeded, selectDataset } = this.props;

    const projectChanged = (previousProps.project.properties.id !== project.properties.id);
    const datasetChanged = (previousProps.datasetSelector.datasetId !== datasetSelector.datasetId);

    if (projectChanged || (project.properties.id && !datasetSelector.datasetId)) {
      fetchDatasetsIfNeeded(project.properties.id);
    }
    if (datasetChanged) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId);
    }
  }

  render() {
    const { datasets, datasetSelector, fieldProperties, filters, selectVisualizationType, selectAggregationFunction, selectFieldProperty, selectDataset } = this.props;
    return (
      <Sidebar>
        { datasets.items && datasets.items.length > 0 &&
          <SidebarGroup heading="Dataset">
            <DropDownMenu
              value={ `${ datasetSelector.datasetId }` }
              options={ datasets.items }
              valueMember="datasetId"
              displayTextMember="title"
              onChange={ selectDataset } />
          </SidebarGroup>
        }
        { datasets.items && datasets.items.length > 0 &&
          <SidebarGroup heading="Visualization type">
            <ToggleButtonGroup
              toggleItems={ filters.visualizationTypes }
              displayTextMember="label"
              valueMember="type"
              imageNameMember="imageName"
              imageNameSuffix=".chart.svg"
              onChange={ selectVisualizationType } />
          </SidebarGroup>
        }
        { fieldProperties.items.length > 0 &&
          <SidebarGroup heading="Fields">
            <ToggleButtonGroup
              toggleItems={ fieldProperties.items }
              displayTextMember="name"
              valueMember="id"
              separated={ true }
              selectMenuItem={ selectAggregationFunction }
              onChange={ selectFieldProperty } />
          </SidebarGroup>
        }
      </Sidebar>
    );
  }
}

GallerySidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasets, datasetSelector, fieldProperties, filters } = state;
  return {
    project,
    datasets,
    datasetSelector,
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
