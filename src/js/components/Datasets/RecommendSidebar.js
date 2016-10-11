import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset, fetchDatasets } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded, selectFieldProperty, selectFieldPropertyValue, selectAggregationFunction } from '../../actions/FieldPropertiesActions';
// import { selectStatisticalRelationship } from '..'
import styles from './DatasetRecommendation.sass'

import _ from 'underscore';

import Sidebar from '../Base/Sidebar';
import SidebarGroup from '../Base/SidebarGroup';
import ToggleButtonGroup from '../Base/ToggleButtonGroup';
import DropDownMenu from '../Base/DropDownMenu';

export class RecommendSidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { project, datasetSelector, recommendSelector, fetchFieldPropertiesIfNeeded, queryFields, selectFieldProperty } = this.props;
    if (project.id && datasetSelector.datasetId && (recommendSelector.datasetId != datasetSelector.datasetId) && !recommendSelector.isFetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId, queryFields);
    }

    if (recommendSelector.fieldProperties.length && queryFields.length) {
      queryFields.forEach((queryFieldName) =>
        selectFieldProperty(recommendSelector.fieldProperties.find((property) => property.name == queryFieldName).id)
      );
    }
  }

  componentDidUpdate(previousProps) {
    const { project, datasetSelector, recommendSelector, fetchFieldPropertiesIfNeeded, queryFields, selectFieldProperty } = this.props;

    const projectChanged = (previousProps.project.id !== project.id);
    const datasetChanged = (previousProps.datasetSelector.datasetId !== datasetSelector.datasetId);

    const queryFieldsChanged = _.union(_.difference(previousProps.queryFields, queryFields), _.difference(queryFields, previousProps.queryFields));

    if (queryFieldsChanged.length) {
      queryFieldsChanged.forEach((queryFieldName) =>
        selectFieldProperty(recommendSelector.fieldProperties.find((property) => property.name == queryFieldName).id)
      );
    }

    if (project.id && (datasetChanged || (!recommendSelector.isFetching && (recommendSelector.datasetId != datasetSelector.datasetId)))) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId, queryFields);
    }
  }

  clickFieldProperty = (fieldPropertyId) => {
    const { recommendSelector, project, datasetSelector, push } = this.props;
    var selectedFieldPropertiesQueryString = recommendSelector.fieldProperties
      .filter((property) => (!property.selected && property.id == fieldPropertyId) || (property.selected && property.id != fieldPropertyId))
      .map((property) => `fields%5B%5D=${ property.name }`);

    if (selectedFieldPropertiesQueryString.length) {
      selectedFieldPropertiesQueryString = selectedFieldPropertiesQueryString.reduce((a, b) => a + "&" + b);
    }

    push(`/projects/${ project.id }/datasets/${ datasetSelector.datasetId }/recommend?${ selectedFieldPropertiesQueryString }`);
  }

  render() {
    const {
      datasets,
      datasetSelector,
      recommendSelector,
      filters,
      selectFieldProperty
    } = this.props;

    return (
      <Sidebar>
        <SidebarGroup heading="Statistical Relationship">
          {/* <DropDownMenu
            options={ recommendSelector.statisticalRelationships }
            valueMember="value"
            displayTextMember="label"
            onChange={ selectStatisticalRelationship } /> */}
        </SidebarGroup>
        <SidebarGroup heading="Find Visualizations by Field">
          { recommendSelector.fieldProperties.filter((property) => property.generalType == 'c').length > 0 &&
            <div className={ styles.fieldGroup }>
              <div className={ styles.fieldGroupLabel }>Categorical</div>
              <ToggleButtonGroup
                toggleItems={ recommendSelector.fieldProperties.filter((property) => property.generalType == 'c').map((item) =>
                  new Object({
                    id: item.id,
                    name: item.name,
                    selected: item.selected,
                    disabled: item.isId,
                    color: item.color
                  })
                )}
                displayTextMember="name"
                valueMember="id"
                colorMember="color"
                splitMenuItemsMember="values"
                separated={ true }
                selectMenuItem={ this.clickFieldPropertyValue }
                onChange={ this.clickFieldProperty } />
            </div>
          }
          { recommendSelector.fieldProperties.filter((property) => property.generalType == 't').length > 0 &&
            <div className={ styles.fieldGroup }>
              <div className={ styles.fieldGroupLabel }>Temporal</div>
              <ToggleButtonGroup
                toggleItems={ recommendSelector.fieldProperties.filter((property) => property.generalType == 't').map((item) =>
                  new Object({
                    id: item.id,
                    name: item.name,
                    selected: item.selected,
                    disabled: item.isId,
                    color: item.color
                  })
                )}
                displayTextMember="name"
                valueMember="id"
                colorMember="color"
                separated={ true }
                selectMenuItem={ selectAggregationFunction }
                onChange={ this.clickFieldProperty } />
            </div>
          }
          { recommendSelector.fieldProperties.filter((property) => property.generalType == 'q').length > 0 &&
            <div className={ styles.fieldGroup }>
              <div className={ styles.fieldGroupLabel }>Quantitative</div>
              <ToggleButtonGroup
                toggleItems={ recommendSelector.fieldProperties.filter((property) => property.generalType == 'q').map((item) =>
                  new Object({
                    id: item.id,
                    name: item.name,
                    selected: item.selected,
                    disabled: item.isId,
                    color: item.color
                  })
                )}
                displayTextMember="name"
                valueMember="id"
                colorMember="color"
                splitMenuItemsMember="aggregations"
                separated={ true }
                selectMenuItem={ selectAggregationFunction }
                onChange={ this.clickFieldProperty } />
            </div>
          }
        </SidebarGroup>
      </Sidebar>
    );
  }
}

function mapStateToProps(state) {
  const {
    project,
    datasets,
    datasetSelector,
    recommendSelector,
    filters
  } = state;
  return {
    project,
    datasets,
    datasetSelector,
    recommendSelector,
    filters
  };
}

export default connect(mapStateToProps, {
  fetchFieldPropertiesIfNeeded,
  selectFieldProperty,
  fetchDatasets,
  selectDataset,
  push
})(RecommendSidebar);
