import _ from 'underscore';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetchDatasets } from '../../../actions/DatasetActions';
import { sortSpecsByFunction, getValidSpecLevelsFromNumFields, clearVisualization, updateVisualizationStats, fetchSpecs, selectSortingFunction, createExportedSpec, setPersistedQueryString } from '../../../actions/VisualizationActions';
import { fetchExportedVisualizationSpecs } from '../../../actions/ComposeActions';
import { useWhiteFontFromBackgroundHex, updateQueryString } from '../../../helpers/helpers';

import styles from '../Visualizations.sass';

import { Button, Intent } from '@blueprintjs/core';

import ErrorComponent from '../../Base/ErrorComponent';
import Loader from '../../Base/Loader';
import HeaderBar from '../../Base/HeaderBar';
import DropDownMenu from '../../Base/DropDownMenu';
import ColoredFieldItems from '../../Base/ColoredFieldItems';
import SpecSection from './SpecSection';

export class ExploreView extends Component {
  componentWillMount() {
    const { datasetSelector, datasets, fieldProperties, project, specs, exploreSelector, clearVisualization, fieldIds, recommendationMode, fetchSpecs, fetchDatasets } = this.props;
    const { isFetchingSpecLevel, loadedSpecLevel, recommendationTypes } = exploreSelector;
    const notLoadedAndNotFetching = (!specs.loaded && !specs.isFetching && !specs.error);

    if (project.id && (!datasetSelector.id || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(project.id);
    }

    const numFields = fieldIds.length;
    const selectedFieldProperties = fieldProperties.items.filter((property) => fieldIds.indexOf(property.id) > -1);
    var isValidSpecLevel = getValidSpecLevelsFromNumFields(numFields, recommendationMode);

    if (project.id && datasetSelector.id && fieldProperties.loaded) {
      for (var i in isFetchingSpecLevel) {
        if (!isFetchingSpecLevel[i] && !loadedSpecLevel[i] && isValidSpecLevel[i]) {
          fetchSpecs(project.id, datasetSelector.id, selectedFieldProperties, recommendationTypes[i]);
        }
      }
    }

    clearVisualization();
  }

  componentWillUpdate(nextProps) {
    const { datasetSelector, datasets, fieldIds, project, specs, fieldProperties, exploreSelector, exportedSpecs, recommendationMode, fetchExportedVisualizationSpecs, fetchSpecs, fetchDatasets } = nextProps;
    const { isFetchingSpecLevel, loadedSpecLevel, recommendationTypes } = exploreSelector;

    const datasetChanged = (this.props.datasetSelector.id !== datasetSelector.id);
    const notLoadedAndNotFetching = (!specs.loaded && !specs.isFetching && !specs.error);
    const projectChanged = (this.props.project.id !== project.id);
    const fieldPropertiesSelected = exploreSelector.fieldProperties.find((prop) => prop.selected) != undefined;

    if (projectChanged || (project.id && (!datasetSelector.id || (!datasets.isFetching && !datasets.loaded)))) {
      fetchDatasets(project.id);
    }

    const numFields = fieldIds.length;
    const selectedFieldProperties = fieldProperties.items.filter((property) => fieldIds.indexOf(property.id) > -1);
    var isValidSpecLevel = getValidSpecLevelsFromNumFields(numFields, recommendationMode);

    if (project.id && datasetSelector.id && fieldProperties.loaded) {
      for (var i in isFetchingSpecLevel) {
        if (!isFetchingSpecLevel[i] && !loadedSpecLevel[i] && isValidSpecLevel[i]) {
          fetchSpecs(project.id, datasetSelector.id, selectedFieldProperties, recommendationTypes[i]);
        }
      }
    }

    if (project.id && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
      fetchExportedVisualizationSpecs(project.id);
    }

    clearVisualization();
  }

  onClickVisualization = (specId) => {
    const { project, datasetSelector, push, updateVisualizationStats } = this.props;
    // updateVisualizationStats(project.id, specId, 'click');
    push(`/projects/${ project.id }/datasets/${ datasetSelector.id }/visualize/explore/${ specId }`);
  }

  saveVisualization = (specId, specData, config) => {
    const { project, createExportedSpec } = this.props;

    createExportedSpec(project.id, specId, specData, [], {}, true);
  }

  clickQueryStringTrackedItem = (newObj, resetState=true) => {
    const { pathname, queryObject, setPersistedQueryString, push } = this.props;
    const newQueryString = updateQueryString(queryObject, newObj);

    setPersistedQueryString(newQueryString, resetState);
    push(`${ pathname }${ newQueryString }`);
  }

  render() {
    const { filters, datasets, fieldNameToColor, fieldProperties, datasetSelector, filteredVisualizationTypes, exploreSelector, specs, exportedSpecs, recommendationMode, fieldIds, sortBy, selectSortingFunction } = this.props;
    const { isFetchingSpecLevel, errorByLevel, loadedSpecLevel, progressByLevel } = exploreSelector;
    const isFetching = _.any(isFetchingSpecLevel);

    var sortSpecs = function(specA, specB) {
      return sortSpecsByFunction(sortBy, specA, specB);
    };

    const numFields = fieldIds.length;
    var isValidSpecLevel = getValidSpecLevelsFromNumFields(fieldIds.length, recommendationMode);
    const selectedFieldProperties = fieldProperties.items.filter((property) => fieldIds.indexOf(property.id) > -1);

    const filteredSpecs = specs.items.filter((spec) =>
      (filteredVisualizationTypes.length == 0) || filteredVisualizationTypes.some((filter) =>
        spec.vizTypes.indexOf(filter) >= 0
      )
    );

    const sortedSpecs = filteredSpecs.sort(sortSpecs);

    const areFieldsSelected = selectedFieldProperties.length > 0;
    const baselineSpecs = sortedSpecs.filter((spec) => spec.recommendationType == 'baseline');
    const subsetSpecs = sortedSpecs.filter((spec) => spec.recommendationType == 'subset');
    const exactSpecs = sortedSpecs.filter((spec) => spec.recommendationType == 'exact');
    const expandedSpecs = sortedSpecs.filter((spec) => spec.recommendationType == 'expanded');

    let pageHeader;
    let helperText;
    if (areFieldsSelected) {
      pageHeader = <span>Visualizations of <ColoredFieldItems fields={ selectedFieldProperties.map((field) => field.name) } /></span>
      helperText = 'exploreSelectedFields'
    } else {
      pageHeader = <span>Descriptive Visualizations</span>
      helperText = 'exploreDefault'
    }

    const recommendationTypesWithData = [
      {
        typeId: 'exact',
        title: 'Exact Matches',
        helperText: 'exactMatches',
        showHeader: areFieldsSelected,
        specs: sortedSpecs.filter((spec) => spec.recommendationType == 'exact')
      },
      {
        typeId: 'subset',
        title: 'Subset Matches',
        helperText: 'closeMatches',
        showHeader: true,
        specs: sortedSpecs.filter((spec) => spec.recommendationType == 'subset')
      },
      {
        typeId: 'individual',
        title: 'Individual Matches',
        helperText: 'individualMatches',
        showHeader: true,
        specs: sortedSpecs.filter((spec) => spec.recommendationType == 'baseline')
      },
      {
        typeId: 'expanded',
        title: 'Expanded Matches',
        helperText: 'expandedMatches',
        showHeader: true,
        specs: sortedSpecs.filter((spec) => spec.recommendationType == 'expanded')
      }
    ]

    const context = this;
    return (
      <div className={ styles.specsContainer }>
        <div className={ styles.innerSpecsContainer }>
          <HeaderBar header={ pageHeader } helperText={ helperText } />
          <div className={ styles.specContainer + ' ' + styles.fillContainer}>
            { !isFetching && sortedSpecs.length == 0 &&
              <ErrorComponent
                title='No Visualizations Returned'
                description='Please change your selection or refresh DIVE.'
                visual='timeline-line-chart'
              />
            }
            { recommendationTypesWithData.map(function(d, i){
              if (isValidSpecLevel[i] && !(loadedSpecLevel[i] && d.specs.length == 0)) {
                return (
                  <div className={ styles.specSection } key={ `spec-section-${ i }` }>
                    { d.showHeader &&
                      <HeaderBar
                        header={ d.title + ( d.specs.length ? ` (${ d.specs.length })` : '' ) }
                        helperText={ d.helperText }
                        className={ styles.blockSectionHeader }
                        textClassName={ styles.blockSectionHeaderTitle }
                      />
                    }
                    { errorByLevel[i] &&
                      <ErrorComponent
                        title='Error Creating Visualizations'
                        description={ errorByLevel[i] }
                      />
                    }
                    { isFetchingSpecLevel[i] && <Loader text={ progressByLevel[i] }/> }
                    { d.specs.length > 0 &&
                      <SpecSection
                        key={ `spec-section-${ d.typeId }`}
                        specs={ d.specs }
                        isCard={ true }
                        className='exact'
                        fieldNameToColor={ fieldNameToColor }
                        filteredVisualizationTypes={ filteredVisualizationTypes }
                        exportedSpecs={ exportedSpecs }
                        onClick={ context.onClickVisualization }
                        saveVisualization={ context.saveVisualization }
                        showStats={ false }
                      />
                   }
                  </div>
                )
              } else {
                return;
              }
            })}
            { areFieldsSelected && (recommendationMode == 'regular') &&
              <div className={ styles.specSection }>
                <HeaderBar
                  header='Expanded Matches (0)'
                  helperText='expandedMatches'
                  className={ styles.blockSectionHeader }
                  textClassName={ styles.blockSectionHeaderTitle }
                />
                <div className={ styles.specs + ' ' + styles.expandedPlaceholder}>
                  <Button
                    iconName='predictive-analysis'
                    intent={ Intent.PRIMARY }
                    text='Click for expanded matches'
                    onClick={(v) => context.clickQueryStringTrackedItem({ recommendationMode: 'expanded' }, false) }
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

ExploreView.propTypes = {
  project: PropTypes.object.isRequired,
  specs: PropTypes.object.isRequired,
  exploreSelector: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  filteredVisualizationTypes: PropTypes.array.isRequired,
  exportedSpecs: PropTypes.object.isRequired,
  fieldIds: PropTypes.array.isRequired,
  recommendationMode: PropTypes.string,
  sortBy: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  queryObject: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { project, filters, specs, fieldProperties, exploreSelector, datasets, datasetSelector, exportedSpecs } = state;
  return {
    project,
    filters,
    specs,
    exploreSelector,
    fieldProperties,
    fieldNameToColor: fieldProperties.fieldNameToColor,
    datasets,
    datasetSelector,
    exportedSpecs,
  }
}

export default connect(mapStateToProps, {
  push,
  fetchSpecs,
  fetchExportedVisualizationSpecs,
  fetchDatasets,
  clearVisualization,
  updateVisualizationStats,
  selectSortingFunction,
  createExportedSpec,
  updateQueryString,
  setPersistedQueryString
})(ExploreView);
