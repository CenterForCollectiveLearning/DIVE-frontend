import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectDataset, fetchDatasetsIfNeeded } from '../../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded, selectFieldProperty, selectFieldPropertyValue, selectAggregationFunction } from '../../../actions/FieldPropertiesActions';
import { selectVisualizationType } from '../../../actions/VisualizationActions';
import styles from '../Visualizations.sass';

import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class GallerySidebar extends Component {
  componentWillMount() {
    const { project, datasetSelector, gallerySelector, fetchDatasetsIfNeeded, fetchFieldPropertiesIfNeeded, selectDataset, datasets } = this.props;

    if (project.properties.id && (!datasetSelector.datasetId || !datasets.loaded)) {
      fetchDatasetsIfNeeded(project.properties.id);
    }
    if (datasetSelector.datasetId && !gallerySelector.fieldProperties.length && !gallerySelector.isFetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId);
    }
  }

  componentDidUpdate(previousProps) {
    const { project, datasetSelector, gallerySelector, fetchDatasetsIfNeeded, fetchFieldPropertiesIfNeeded, selectDataset, datasets } = this.props;

    const projectChanged = (previousProps.project.properties.id !== project.properties.id);
    const datasetChanged = (previousProps.datasetSelector.datasetId !== datasetSelector.datasetId);

    if (projectChanged || (project.properties.id && (!datasetSelector.datasetId || !datasets.loaded))) {
      fetchDatasetsIfNeeded(project.properties.id);
    }
    if (datasetChanged) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId);
    }
  }

  render() {
    const { datasets, datasetSelector, gallerySelector, filters, selectVisualizationType, selectFieldPropertyValue, selectFieldProperty, selectDataset, selectAggregationFunction } = this.props;
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
        { gallerySelector.fieldProperties.length > 0 &&
          <SidebarGroup heading="Fields">
            <ToggleButtonGroup
              toggleItems={ gallerySelector.fieldProperties.filter((property) => property.generalType == 'c') }
              displayTextMember="name"
              valueMember="id"
              splitMenuItemsMember="values"
              separated={ true }
              selectMenuItem={ selectFieldPropertyValue }
              onChange={ selectFieldProperty } />
            <ToggleButtonGroup
              toggleItems={ gallerySelector.fieldProperties.filter((property) => property.generalType == 'q') }
              displayTextMember="name"
              valueMember="id"
              splitMenuItemsMember="aggregations"
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
  gallerySelector: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasets, datasetSelector, gallerySelector, filters } = state;
  return {
    project,
    datasets,
    datasetSelector,
    gallerySelector,
    filters
  };
}

export default connect(mapStateToProps, {
  fetchDatasetsIfNeeded,
  fetchFieldPropertiesIfNeeded,
  selectDataset,
  selectVisualizationType,
  selectFieldProperty,
  selectFieldPropertyValue,
  selectAggregationFunction
})(GallerySidebar);
