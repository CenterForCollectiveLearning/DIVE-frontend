import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded, selectFieldProperty, selectFieldPropertyValue, selectAggregationFunction } from '../../../actions/FieldPropertiesActions';
import { selectVisualizationType, selectSortingFunction } from '../../../actions/VisualizationActions';
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
    const { project, datasetSelector, gallerySelector, fetchFieldPropertiesIfNeeded, queryFields } = this.props;

    if (project.properties.id && datasetSelector.datasetId && (gallerySelector.datasetId != datasetSelector.datasetId) && !gallerySelector.isFetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId, queryFields);
    }
  }

  componentDidUpdate(previousProps) {
    const { project, datasetSelector, gallerySelector, fetchFieldPropertiesIfNeeded, queryFields, selectFieldProperty } = this.props;

    const projectChanged = (previousProps.project.properties.id !== project.properties.id);
    const datasetChanged = (previousProps.datasetSelector.datasetId !== datasetSelector.datasetId);

    const queryFieldsChanged = _.union(_.difference(previousProps.queryFields, queryFields), _.difference(queryFields, previousProps.queryFields));

    if (queryFieldsChanged.length) {
      queryFieldsChanged.forEach((queryFieldName) =>
        selectFieldProperty(gallerySelector.fieldProperties.find((property) => property.name == queryFieldName).id)
      );
    }

    if (project.properties.id && (datasetChanged || (!gallerySelector.isFetching && (gallerySelector.datasetId != datasetSelector.datasetId)))) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId, queryFields);
    }
  }

  clickFieldProperty(fieldPropertyId) {
    const { gallerySelector, project, datasetSelector, push } = this.props;
    var selectedFieldPropertiesQueryString = gallerySelector.fieldProperties
      .filter((property) => (!property.selected && property.id == fieldPropertyId) || (property.selected && property.id != fieldPropertyId))
      .map((property) => `fields%5B%5D=${ property.name }`);

    if (selectedFieldPropertiesQueryString.length) {
      selectedFieldPropertiesQueryString = selectedFieldPropertiesQueryString.reduce((a, b) => a + "&" + b);
    }

    push(`/projects/${ project.properties.id }/datasets/${ datasetSelector.datasetId }/visualize/explore?${ selectedFieldPropertiesQueryString }`);
  }

  clickFieldPropertyValue(fieldPropertyId, fieldPropertyValueId) {
    const selectedProperty = this.props.gallerySelector.fieldProperties.find((property) => (property.id == fieldPropertyId));
    if (!selectedProperty.selected) {
      this.clickFieldProperty(fieldPropertyId);
    }
    this.props.selectFieldPropertyValue(fieldPropertyId, fieldPropertyValueId);
  }

  render() {
    const {
      visualizationTypes,
      datasets,
      datasetSelector,
      gallerySelector,
      filters,
      filteredVisualizationTypes,
      selectVisualizationType,
      selectFieldPropertyValue,
      selectFieldProperty,
      selectAggregationFunction,
      selectSortingFunction
    } = this.props;

    const filteredSpecs = gallerySelector.specs.filter((spec) =>
      (filteredVisualizationTypes.length == 0) || filteredVisualizationTypes.some((filter) =>
        spec.vizTypes.indexOf(filter) >= 0
      )
    );

    return (
      <Sidebar>
        { filteredSpecs.length > 0 &&
          <SidebarGroup heading="Sort By">
            <DropDownMenu
              options={ gallerySelector.sortingFunctions }
              valueMember="value"
              displayTextMember="label"
              onChange={ selectSortingFunction } />
          </SidebarGroup>
        }
        { visualizationTypes.length > 1 &&
          <SidebarGroup heading="Filter Visualization type">
            <ToggleButtonGroup
              toggleItems={ visualizationTypes }
              displayTextMember="label"
              valueMember="type"
              imageNameMember="imageName"
              imageNameSuffix=".chart.svg"
              onChange={ selectVisualizationType } />
          </SidebarGroup>
        }
        { gallerySelector.fieldProperties.length > 0 &&
          <SidebarGroup heading="Find Visualizations by Field">
            { gallerySelector.fieldProperties.filter((property) => property.generalType == 'c').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Categorical</div>
                <ToggleButtonGroup
                  toggleItems={ gallerySelector.fieldProperties.filter((property) => property.generalType == 'c').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      selected: item.selected,
                      disabled: item.isId
                    })
                  )}
                  displayTextMember="name"
                  valueMember="id"
                  splitMenuItemsMember="values"
                  separated={ true }
                  selectMenuItem={ this.clickFieldPropertyValue }
                  onChange={ this.clickFieldProperty } />
              </div>
            }
            { gallerySelector.fieldProperties.filter((property) => property.generalType == 't').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Temporal</div>
                <ToggleButtonGroup
                  toggleItems={ gallerySelector.fieldProperties.filter((property) => property.generalType == 't') }
                  displayTextMember="name"
                  valueMember="id"
                  separated={ true }
                  selectMenuItem={ selectAggregationFunction }
                  onChange={ this.clickFieldProperty } />
              </div>
            }
            { gallerySelector.fieldProperties.filter((property) => property.generalType == 'q').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Quantitative</div>
                <ToggleButtonGroup
                  toggleItems={ gallerySelector.fieldProperties.filter((property) => property.generalType == 'q').map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      selected: item.selected,
                      disabled: item.isId
                    })
                  )}
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
  datasetSelector: PropTypes.object.isRequired,
  gallerySelector: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  queryFields: PropTypes.array.isRequired,
  visualizationTypes: PropTypes.array.isRequired,
  filteredVisualizationTypes: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  const {
    project,
    datasets,
    datasetSelector,
    gallerySelector,
    filters
  } = state;
  return {
    project,
    datasets,
    datasetSelector,
    gallerySelector,
    filters
  };
}

export default connect(mapStateToProps, {
  fetchFieldPropertiesIfNeeded,
  selectVisualizationType,
  selectFieldProperty,
  selectFieldPropertyValue,
  selectAggregationFunction,
  selectSortingFunction,
  fetchDatasets,
  selectDataset,
  push
})(GallerySidebar);
