import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { removeFromQueryString, updateQueryString } from '../../../helpers/helpers';
import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded, selectAggregationFunction } from '../../../actions/FieldPropertiesActions';
import { selectRecommendationMode, selectVisualizationType, selectSortingFunction, setPersistedQueryString } from '../../../actions/VisualizationActions';
import styles from '../Visualizations.sass';

import _ from 'underscore';

import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import SidebarCategoryGroup from '../../Base/SidebarCategoryGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class ExploreSidebar extends Component {

  componentWillMount() {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded, fieldIds } = this.props;

    if (project.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded, fieldIds } = nextProps;

    const datasetIdChanged = datasetSelector.datasetId != this.props.datasetSelector.datasetId;

    if (project.id && datasetSelector.datasetId && (datasetIdChanged || !fieldProperties.items.length) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId)
    }
  }

  clickClearKeyFromQueryString = (key) => {
    const { pathname, queryObject, setPersistedQueryString, push } = this.props;
    const newQueryString = removeFromQueryString(queryObject, key);
    setPersistedQueryString(newQueryString, true);
    push(`${ pathname }${ newQueryString }`);
  }

  clickQueryStringTrackedItem = (newObj, resetState=true) => {
    const { pathname, queryObject, setPersistedQueryString, push } = this.props;
    const newQueryString = updateQueryString(queryObject, newObj);
    setPersistedQueryString(newQueryString, resetState);
    push(`${ pathname }${ newQueryString }`);
  }

  render() {
    const {
      visualizationTypes,
      fieldProperties,
      datasets,
      datasetSelector,
      exploreSelector,
      filters,
      recommendationMode,
      sortBy,
      filteredVisualizationTypes,
      fieldIds,
      selectVisualizationType,
      selectAggregationFunction,
      selectSortingFunction
    } = this.props;

    const filteredSpecs = exploreSelector.specs.filter((spec) =>
      (filteredVisualizationTypes.length == 0) || filteredVisualizationTypes.some((filter) =>
        spec.vizTypes.indexOf(filter) >= 0
      )
    );

    const activeVisualizationTypes = visualizationTypes.filter((type) => !type.disabled);

    return (
      <Sidebar>
        <SidebarCategoryGroup heading="Recommendation Options" initialCollapse={ true } iconName="predictive-analysis">
          <SidebarGroup heading="Recommendation Mode">
            <ToggleButtonGroup
              toggleItems={ exploreSelector.recommendationModes }
              displayTextMember="name"
              valueMember="id"
              separated={ false }
              externalSelectedItems={ [ recommendationMode ] }
              onChange={ (v) => this.clickQueryStringTrackedItem({ recommendationMode: v }, false) } />
          </SidebarGroup>
          <SidebarGroup heading="Sort By">
            <DropDownMenu
              options={ exploreSelector.sortingFunctions }
              valueMember="value"
              displayTextMember="label"
              value={ sortBy }
              onChange={ (v) => this.clickQueryStringTrackedItem({ sortBy: v }, false) } />
          </SidebarGroup>
          { visualizationTypes.length > 1 &&
            <SidebarGroup heading="Filter Visualization type">
              <ToggleButtonGroup
                toggleItems={ activeVisualizationTypes }
                displayTextMember="label"
                expand={ false }
                valueMember="type"
                imageNameMember="imageName"
                imageNameSuffix=".chart.svg"
                externalSelectedItems={ filteredVisualizationTypes }
                onChange={ (v) => this.clickQueryStringTrackedItem({ filteredVisualizationTypes: [ v ] }, false) } />
            </SidebarGroup>
          }
        </SidebarCategoryGroup>
        <SidebarCategoryGroup
          heading="Variable Selection"
          initialCollapse={ false }
          iconName="variable"
          rightAction={ (fieldIds.length > 0) &&
            <span className={ 'pt-icon-standard pt-icon-delete' }
              onClick={ (v) => this.clickClearKeyFromQueryString('fieldIds') }
            />
          }
        >
          { fieldProperties.items.length > 0 && fieldProperties.items.filter((property) => property.generalType == 'c').length > 0 &&
            <div className={ styles.fieldGroup }>
              <div className={ styles.fieldGroupHeader }>
                <div className={ styles.fieldGroupLabel }>Categorical</div>
              </div>
              <ToggleButtonGroup
                toggleItems={ fieldProperties.items.filter((p) => p.generalType == 'c' && !p.isId).map((item) =>
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
          { fieldProperties.items.filter((property) => property.generalType == 't').length > 0 &&
            <div className={ styles.fieldGroup }>
              <div className={ styles.fieldGroupLabel }>Temporal</div>
              <ToggleButtonGroup
                toggleItems={ fieldProperties.items.filter((property) => property.generalType == 't').map((item) =>
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
          { fieldProperties.items.filter((property) => property.generalType == 'q').length > 0 &&
            <div className={ styles.fieldGroup }>
              <div className={ styles.fieldGroupLabel }>Quantitative</div>
              <ToggleButtonGroup
                toggleItems={ fieldProperties.items.filter((property) => property.generalType == 'q').map((item) =>
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
        </SidebarCategoryGroup>
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
  recommendationMode: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  filteredVisualizationTypes: PropTypes.array.isRequired,
  fieldIds: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired,
  queryObject: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const {
    project,
    datasets,
    datasetSelector,
    exploreSelector,
    fieldProperties,
    filters
  } = state;
  return {
    project,
    datasets,
    datasetSelector,
    exploreSelector,
    fieldProperties,
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
  setPersistedQueryString,
  push
})(ExploreSidebar);
