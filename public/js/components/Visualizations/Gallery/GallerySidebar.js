import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { selectDataset, fetchDatasetsIfNeeded } from '../../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded, selectFieldProperty, selectFieldPropertyValue, selectAggregationFunction } from '../../../actions/FieldPropertiesActions';
import { selectVisualizationType } from '../../../actions/VisualizationActions';
import styles from '../Visualizations.sass';

import _ from 'underscore';

import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class GallerySidebar extends Component {
  constructor(props) {
    super(props);

    this.clickFieldProperty = this.clickFieldProperty.bind(this);
    this.clickFieldPropertyValue = this.clickFieldPropertyValue.bind(this);
  }

  componentWillMount() {
    const { project, datasetSelector, gallerySelector, fetchDatasetsIfNeeded, fetchFieldPropertiesIfNeeded, datasets, queryFields } = this.props;

    if (project.properties.id && (!datasetSelector.datasetId || !datasets.loaded)) {
      fetchDatasetsIfNeeded(project.properties.id);
    }
    if (project.properties.id && datasetSelector.datasetId && (gallerySelector.datasetId != datasetSelector.datasetId) && !gallerySelector.isFetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId, queryFields);
    }
  }

  componentDidUpdate(previousProps) {
    const { project, datasetSelector, gallerySelector, fetchDatasetsIfNeeded, fetchFieldPropertiesIfNeeded, datasets, queryFields, selectFieldProperty } = this.props;

    const projectChanged = (previousProps.project.properties.id !== project.properties.id);
    const datasetChanged = (previousProps.datasetSelector.datasetId !== datasetSelector.datasetId);

    const queryFieldsChanged = _.union(_.difference(previousProps.queryFields, queryFields), _.difference(queryFields, previousProps.queryFields));

    if (queryFieldsChanged.length) {
      queryFieldsChanged.forEach((queryFieldName) =>
        selectFieldProperty(gallerySelector.fieldProperties.find((property) => property.name == queryFieldName).id)
      );
    }

    if (projectChanged || (project.properties.id && (!datasetSelector.datasetId || !datasets.loaded))) {
      fetchDatasetsIfNeeded(project.properties.id);
    }
    if (project.properties.id && (datasetChanged || (!gallerySelector.isFetching && (gallerySelector.datasetId != datasetSelector.datasetId)))) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId, queryFields);
    }
  }

  clickFieldProperty(fieldPropertyId) {
    const { gallerySelector, project, datasetSelector, pushState } = this.props;
    var selectedFieldPropertiesQueryString = gallerySelector.fieldProperties
      .filter((property) => (!property.selected && property.id == fieldPropertyId) || (property.selected && property.id != fieldPropertyId))
      .map((property) => `fields%5B%5D=${ property.name }`);

    if (selectedFieldPropertiesQueryString.length) {
      selectedFieldPropertiesQueryString = selectedFieldPropertiesQueryString.reduce((a, b) => a + "&" + b);
    }

    pushState(null, `/projects/${ project.properties.id }/datasets/${ datasetSelector.datasetId }/visualize/gallery?${ selectedFieldPropertiesQueryString }`);
  }

  clickFieldPropertyValue(fieldPropertyId, fieldPropertyValueId) {
    const selectedProperty = this.props.gallerySelector.fieldProperties.find((property) => (property.id == fieldPropertyId));
    if (!selectedProperty.selected) {
      this.clickFieldProperty(fieldPropertyId);
    }
    this.props.selectFieldPropertyValue(fieldPropertyId, fieldPropertyValueId);
  }

  clickDataset(datasetId) {
    const { gallerySelector, project, pushState, selectDataset } = this.props;
    var selectedFieldPropertiesQueryString = gallerySelector.fieldProperties
      .filter((property) => property.selected)
      .map((property) => `fields%5B%5D=${ property.name }`);

    if (selectedFieldPropertiesQueryString.length) {
      selectedFieldPropertiesQueryString = selectedFieldPropertiesQueryString.reduce((a, b) => a + "&" + b);
    }

    selectDataset(datasetId);
    pushState(null, `/projects/${ project.properties.id }/datasets/${ datasetId }/visualize/gallery?${ selectedFieldPropertiesQueryString }`);    
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
              onChange={ this.clickDataset.bind(this) } />
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
            { gallerySelector.fieldProperties.filter((property) => property.generalType == 'c').length > 0 &&
              <div>
                <div className={ styles.fieldGroupLabel }>Categorical</div>
                <ToggleButtonGroup
                  toggleItems={ gallerySelector.fieldProperties.filter((property) => property.generalType == 'c') }
                  displayTextMember="name"
                  valueMember="id"
                  splitMenuItemsMember="values"
                  separated={ true }
                  selectMenuItem={ this.clickFieldPropertyValue }
                  onChange={ this.clickFieldProperty } />
              </div>
            }
            { gallerySelector.fieldProperties.filter((property) => property.generalType == 't').length > 0 &&
              <div>
                <div className={ styles.fieldGroupLabel }>Temporal</div>
                <ToggleButtonGroup
                  toggleItems={ gallerySelector.fieldProperties.filter((property) => property.generalType == 't') }
                  displayTextMember="name"
                  valueMember="id"
                  splitMenuItemsMember="aggregations"
                  separated={ true }
                  selectMenuItem={ selectAggregationFunction }
                  onChange={ this.clickFieldProperty } />
              </div>
            }
            { gallerySelector.fieldProperties.filter((property) => property.generalType == 'q').length > 0 &&
              <div>
                <div className={ styles.fieldGroupLabel }>Quantitative</div>
                <ToggleButtonGroup
                  toggleItems={ gallerySelector.fieldProperties.filter((property) => property.generalType == 'q') }
                  displayTextMember="name"
                  valueMember="id"
                  splitMenuItemsMember="aggregations"
                  separated={ true }
                  selectMenuItem={ selectAggregationFunction }
                  onChange={ this.clickFieldProperty } />
              </div>
            }
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
  filters: PropTypes.object.isRequired,
  queryFields: PropTypes.array.isRequired
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
  selectAggregationFunction,
  pushState
})(GallerySidebar);
