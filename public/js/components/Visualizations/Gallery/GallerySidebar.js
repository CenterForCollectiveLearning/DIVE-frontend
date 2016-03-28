import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

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
    const { gallerySelector, project, datasetSelector, pushState } = this.props;
    var selectedFieldPropertiesQueryString = gallerySelector.fieldProperties
      .filter((property) => (!property.selected && property.id == fieldPropertyId) || (property.selected && property.id != fieldPropertyId))
      .map((property) => `fields%5B%5D=${ property.name }`);

    if (selectedFieldPropertiesQueryString.length) {
      selectedFieldPropertiesQueryString = selectedFieldPropertiesQueryString.reduce((a, b) => a + "&" + b);
    }

    pushState(null, `/projects/${ project.properties.id }/datasets/${ datasetSelector.datasetId }/visualize/explore?${ selectedFieldPropertiesQueryString }`);
  }

  clickFieldPropertyValue(fieldPropertyId, fieldPropertyValueId) {
    const selectedProperty = this.props.gallerySelector.fieldProperties.find((property) => (property.id == fieldPropertyId));
    if (!selectedProperty.selected) {
      this.clickFieldProperty(fieldPropertyId);
    }
    this.props.selectFieldPropertyValue(fieldPropertyId, fieldPropertyValueId);
  }

  render() {
    const { visualizationTypes, datasetSelector, gallerySelector, filters, selectVisualizationType, selectFieldPropertyValue, selectFieldProperty, selectAggregationFunction } = this.props;

    return (
      <Sidebar>
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
              <div className={ styles.fieldGroup }>
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
              <div className={ styles.fieldGroup }>
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
  datasetSelector: PropTypes.object.isRequired,
  gallerySelector: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  queryFields: PropTypes.array.isRequired,
  visualizationTypes: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  const { project, datasetSelector, gallerySelector, filters } = state;
  return {
    project,
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
  pushState
})(GallerySidebar);
