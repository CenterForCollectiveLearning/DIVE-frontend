import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { updateQueryString } from '../../../helpers/helpers';
import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded, selectAggregationFunction } from '../../../actions/FieldPropertiesActions';
import { selectRecommendationMode, selectVisualizationType, selectSortingFunction, setQueryString } from '../../../actions/VisualizationActions';
import styles from '../Visualizations.sass';

import _ from 'underscore';

import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class ExploreSidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { project, datasetSelector, exploreSelector, fetchFieldPropertiesIfNeeded, fieldIds } = this.props;
    if (project.id && datasetSelector.datasetId && (exploreSelector.datasetId != datasetSelector.datasetId) && !exploreSelector.isFetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId, fieldIds);
    }
  }

  componentDidUpdate(previousProps) {
    const { project, datasetSelector, exploreSelector, fetchFieldPropertiesIfNeeded, fieldIds } = this.props;

    const projectChanged = (previousProps.project.id !== project.id);
    const datasetChanged = (previousProps.datasetSelector.datasetId !== datasetSelector.datasetId);

    const fieldIdsChanged = _.union(_.difference(previousProps.fieldIds, fieldIds), _.difference(fieldIds, previousProps.fieldIds));

    if (project.id && (datasetChanged || (!exploreSelector.isFetching && (exploreSelector.datasetId != datasetSelector.datasetId)))) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId, fieldIds);
    }
  }

  clickQueryStringTrackedItem = (newObj) => {
    const { pathname, queryObject, setQueryString, push } = this.props;
    const newQueryString = updateQueryString(queryObject, newObj);
    setQueryString(newQueryString);
    push(`${ pathname }${ newQueryString }`);
  }

  clickRecommendationMode = (recommendationModeId) => {
    const { selectRecommendationMode } = this.props;
    selectRecommendationMode(recommendationModeId);
  }

  // clickFieldPropertyValue = (fieldPropertyId, fieldPropertyValueId) => {
  //   const selectedProperty = this.props.exploreSelector.fieldProperties.find((property) => (property.id == fieldPropertyId));
  //   if (!selectedProperty.selected) {
  //     this.clickFieldProperty(fieldPropertyId);
  //   }
  //   this.props.selectFieldPropertyValue(fieldPropertyId, fieldPropertyValueId);
  // }

  render() {
    const {
      visualizationTypes,
      fieldIds,
      datasets,
      datasetSelector,
      exploreSelector,
      filters,
      filteredVisualizationTypes,
      selectVisualizationType,
      selectAggregationFunction,
      selectSortingFunction
    } = this.props;

    const filteredSpecs = exploreSelector.specs.filter((spec) =>
      (filteredVisualizationTypes.length == 0) || filteredVisualizationTypes.some((filter) =>
        spec.vizTypes.indexOf(filter) >= 0
      )
    );

    return (
      <Sidebar>
        <SidebarGroup heading="Recommendation Mode">
          <ToggleButtonGroup
            toggleItems={ exploreSelector.recommendationModes }
            displayTextMember="name"
            valueMember="id"
            separated={ false }
            onChange={ this.clickRecommendationMode } />
        </SidebarGroup>
        <SidebarGroup heading="Sort By">
          <DropDownMenu
            options={ exploreSelector.sortingFunctions }
            valueMember="value"
            displayTextMember="label"
            onChange={ selectSortingFunction } />
        </SidebarGroup>
        { visualizationTypes.length > 1 &&
          <SidebarGroup heading="Filter Visualization type">
            <ToggleButtonGroup
              toggleItems={ visualizationTypes }
              displayTextMember="label"
              expand={ false }
              valueMember="type"
              imageNameMember="imageName"
              imageNameSuffix=".chart.svg"
              onChange={ selectVisualizationType } />
          </SidebarGroup>
        }
        { exploreSelector.fieldProperties.length > 0 &&
          <SidebarGroup heading="Find Visualizations by Field">
            { exploreSelector.fieldProperties.filter((property) => property.generalType == 'c').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Categorical</div>
                <ToggleButtonGroup
                  toggleItems={ exploreSelector.fieldProperties.filter((property) => property.generalType == 'c').map((item) =>
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
                  externalSelectedItems={ fieldIds }
                  onChange={ (v) => this.clickQueryStringTrackedItem({ fieldIds: [ parseInt(v) ]}) } />
              </div>
            }
            { exploreSelector.fieldProperties.filter((property) => property.generalType == 't').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Temporal</div>
                <ToggleButtonGroup
                  toggleItems={ exploreSelector.fieldProperties.filter((property) => property.generalType == 't').map((item) =>
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
                  externalSelectedItems={ fieldIds }
                  onChange={ (v) => this.clickQueryStringTrackedItem({ fieldIds: [ parseInt(v) ]}) } />
              </div>
            }
            { exploreSelector.fieldProperties.filter((property) => property.generalType == 'q').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Quantitative</div>
                <ToggleButtonGroup
                  toggleItems={ exploreSelector.fieldProperties.filter((property) => property.generalType == 'q').map((item) =>
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
                  externalSelectedItems={ fieldIds }
                  onChange={ (v) => this.clickQueryStringTrackedItem({ fieldIds: [ parseInt(v) ]}) } />
              </div>
            }
          </SidebarGroup>
        }
      </Sidebar>
    );
  }
}

ExploreSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  exploreSelector: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  visualizationTypes: PropTypes.array.isRequired,
  filteredVisualizationTypes: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired,
  queryObject: PropTypes.object.isRequired,
  fieldIds: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  const {
    project,
    datasets,
    datasetSelector,
    exploreSelector,
    filters
  } = state;
  return {
    project,
    datasets,
    datasetSelector,
    exploreSelector,
    filters
  };
}

export default connect(mapStateToProps, {
  fetchFieldPropertiesIfNeeded,
  selectVisualizationType,
  selectAggregationFunction,
  selectRecommendationMode,
  selectSortingFunction,
  fetchDatasets,
  selectDataset,
  updateQueryString,
  setQueryString,
  push
})(ExploreSidebar);
