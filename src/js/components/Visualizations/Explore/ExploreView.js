import _ from 'underscore';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetchDatasets } from '../../../actions/DatasetActions';
import { getValidSpecLevelsFromNumFields, clearVisualization, updateVisualizationStats, fetchSpecs, selectSortingFunction, createExportedSpec } from '../../../actions/VisualizationActions';
import { fetchExportedVisualizationSpecs } from '../../../actions/ComposeActions';
import { useWhiteFontFromBackgroundHex } from '../../../helpers/helpers';

import styles from '../Visualizations.sass';

import Loader from '../../Base/Loader';
import HeaderBar from '../../Base/HeaderBar';
import DropDownMenu from '../../Base/DropDownMenu';
import ColoredFieldItems from '../../Base/ColoredFieldItems';
import Visualization from '../Visualization';
import VisualizationBlock from './VisualizationBlock';

export class ExploreView extends Component {
  componentWillMount() {
    const { datasetSelector, datasets, fieldProperties, project, specs, exploreSelector, clearVisualization, fieldIds, recommendationMode, fetchSpecs, fetchDatasets } = this.props;
    const { isFetchingSpecLevel, loadedSpecLevel, recommendationTypes } = exploreSelector;
    const notLoadedAndNotFetching = (!specs.loaded && !specs.isFetching && !specs.error);

    if (project.id && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(project.id);
    }

    const numFields = fieldIds.length;
    const selectedFieldProperties = fieldProperties.items.filter((property) => fieldIds.indexOf(property.id) > -1);
    var isValidSpecLevel = getValidSpecLevelsFromNumFields(numFields, recommendationMode);

    if (project.id && datasetSelector.datasetId && fieldProperties.loaded) {
      for (var i in isFetchingSpecLevel) {
        if (!isFetchingSpecLevel[i] && !loadedSpecLevel[i] && isValidSpecLevel[i]) {
          fetchSpecs(project.id, datasetSelector.datasetId, selectedFieldProperties, recommendationTypes[i]);
        }
      }
    }

    clearVisualization();
  }

  componentDidUpdate(previousProps) {
    const { datasetSelector, datasets, fieldIds, project, specs, fieldProperties, exploreSelector, exportedSpecs, recommendationMode, fetchExportedVisualizationSpecs, fetchSpecs, fetchDatasets } = this.props;
    const { isFetchingSpecLevel, loadedSpecLevel, recommendationTypes } = exploreSelector;

    const datasetChanged = (datasetSelector.datasetId !== previousProps.datasetSelector.datasetId);
    const notLoadedAndNotFetching = (!specs.loaded && !specs.isFetching && !specs.error);
    const projectChanged = (previousProps.project.id !== project.id);
    const fieldPropertiesSelected = exploreSelector.fieldProperties.find((prop) => prop.selected) != undefined;


    if (projectChanged || (project.id && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded)))) {
      fetchDatasets(project.id);
    }

    const numFields = fieldIds.length;
    const selectedFieldProperties = fieldProperties.items.filter((property) => fieldIds.indexOf(property.id) > -1);
    var isValidSpecLevel = getValidSpecLevelsFromNumFields(numFields, recommendationMode);

    if (project.id && datasetSelector.datasetId && fieldProperties.loaded) {
      for (var i in isFetchingSpecLevel) {
        if (!isFetchingSpecLevel[i] && !loadedSpecLevel[i] && isValidSpecLevel[i]) {
          fetchSpecs(project.id, datasetSelector.datasetId, selectedFieldProperties, recommendationTypes[i]);
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
    push(`/projects/${ project.id }/datasets/${ datasetSelector.datasetId }/visualize/explore/${ specId }`);
  }

  saveVisualization = (specId, specData) => {
    const { project, createExportedSpec } = this.props;
    createExportedSpec(project.id, specId, specData, [], {}, true);
  }

  render() {
    const { filters, datasets, fieldNameToColor, fieldProperties, datasetSelector, filteredVisualizationTypes, exploreSelector, specs, exportedSpecs, recommendationMode, fieldIds, selectSortingFunction } = this.props;
    const { isFetchingSpecLevel, loadedSpecLevel, progressByLevel } = exploreSelector;
    const isFetching = _.any(isFetchingSpecLevel);

    const numFields = fieldIds.length;
    var isValidSpecLevel = getValidSpecLevelsFromNumFields(fieldIds.length, recommendationMode);
    const selectedFieldProperties = fieldProperties.items.filter((property) => fieldIds.indexOf(property.id) > -1);

    const filteredSpecs = specs.items.filter((spec) =>
      (filteredVisualizationTypes.length == 0) || filteredVisualizationTypes.some((filter) =>
        spec.vizTypes.indexOf(filter) >= 0
      )
    );

    const areFieldsSelected = selectedFieldProperties.length > 0;
    const baselineSpecs = filteredSpecs.filter((spec) => spec.recommendationType == 'baseline');
    const subsetSpecs = filteredSpecs.filter((spec) => spec.recommendationType == 'subset');
    const exactSpecs = filteredSpecs.filter((spec) => spec.recommendationType == 'exact');
    const expandedSpecs = filteredSpecs.filter((spec) => spec.recommendationType == 'expanded');

    let pageHeader;
    let helperText;
    if (areFieldsSelected) {
      pageHeader = <span>Visualizations of <ColoredFieldItems fields={ selectedFieldProperties.map((field) => field.name) } /></span>
      helperText = 'exploreSelectedFields'
    } else {
      pageHeader = <span>Default Descriptive Visualizations</span>
      helperText = 'exploreDefault'
    }

    return (
      <div className={ styles.specsContainer }>
        <div className={ styles.innerSpecsContainer }>
          <HeaderBar header={ pageHeader } helperText={ helperText } />
          <div className={ styles.specContainer }>
            { !isFetching && filteredSpecs.length == 0 &&
              <div className={ styles.watermark }>No visualizations</div>
            }
            { isValidSpecLevel[0] && !(loadedSpecLevel[0] && exactSpecs.length == 0) &&
              <div className={ styles.specSection }>
                { areFieldsSelected &&
                  <HeaderBar
                    header={ 'Exact Matches' + ( exactSpecs.length ? ` (${ exactSpecs.length })` : '' ) }
                    helperText='exactMatches'
                    className={ styles.blockSectionHeader }
                    textClassName={ styles.blockSectionHeaderTitle }
                  />
                }
                { isFetchingSpecLevel[0] && <Loader text={ progressByLevel[0] }/> }
                { exactSpecs.length > 0 &&
                  <div className={ styles.specs + ' ' + styles.exact }>
                    { exactSpecs.map((spec, i) =>
                      <VisualizationBlock
                        key={ `${ spec.id }-${ i }` }
                        spec={ spec }
                        className='exact'
                        fieldNameToColor={ fieldNameToColor }
                        filteredVisualizationTypes={ filteredVisualizationTypes }
                        exportedSpecs={ exportedSpecs }
                        onClick={ this.onClickVisualization }
                        saveVisualization={ this.saveVisualization }
                        showStats={ true }
                      />
                      )
                    }
                  </div>
               }
              </div>
            }
            { isValidSpecLevel[1] && !(loadedSpecLevel[1] && subsetSpecs.length == 0) &&
              <div className={ styles.specSection }>
                <HeaderBar
                  header={ 'Subset Matches' + ( subsetSpecs.length ? ` (${ subsetSpecs.length })` : '' ) }
                  helperText='closeMatches'
                  className={ styles.blockSectionHeader }
                  textClassName={ styles.blockSectionHeaderTitle }
                />
                { isFetchingSpecLevel[1] && <Loader text={ progressByLevel[1] }/> }
                { subsetSpecs.length > 0 &&
                  <div className={ styles.specs + ' ' + styles.subset }>
                    { subsetSpecs.map((spec) =>
                      <VisualizationBlock
                        key={ spec.id }
                        spec={ spec }
                        className='subset'
                        fieldNameToColor={ fieldNameToColor }
                        filteredVisualizationTypes={ filteredVisualizationTypes }
                        exportedSpecs={ exportedSpecs }
                        onClick={ this.onClickVisualization }
                        saveVisualization={ this.saveVisualization }
                        showStats={ true }
                      />
                      )
                    }
                  </div>
                }
              </div>
            }
            { isValidSpecLevel[2] && !(loadedSpecLevel[2] && baselineSpecs.length == 0) &&
              <div className={ styles.specSection }>
                <HeaderBar
                  header={ 'Individual Matches' + ( baselineSpecs.length ? ` (${ baselineSpecs.length })` : '' ) }
                  helperText='individualMatches'
                  className={ styles.blockSectionHeader }
                  textClassName={ styles.blockSectionHeaderTitle }
                />
                { isFetchingSpecLevel[2] && <Loader text={ progressByLevel[2] }/> }
                { baselineSpecs.length > 0 &&
                  <div className={ styles.specs + ' ' + styles.baseline }>
                    { baselineSpecs.map((spec) =>
                      <VisualizationBlock
                        key={ spec.id }
                        spec={ spec }
                        className='baseline'
                        fieldNameToColor={ fieldNameToColor }
                        filteredVisualizationTypes={ filteredVisualizationTypes }
                        exportedSpecs={ exportedSpecs }
                        onClick={ this.onClickVisualization }
                        saveVisualization={ this.saveVisualization }
                        showStats={ true }
                      />
                      )
                    }
                  </div>
                }
              </div>
            }
            { isValidSpecLevel[3] && !(loadedSpecLevel[3] && expandedSpecs.length == 0) &&
              <div className={ styles.specSection }>
                <HeaderBar
                  header={ 'Expanded Matches' + ( expandedSpecs.length ? ` (${ expandedSpecs.length })` : '' ) }
                  helperText='expandedMatches'
                  className={ styles.blockSectionHeader }
                  textClassName={ styles.blockSectionHeaderTitle }
                />
                { isFetchingSpecLevel[3] && <Loader text={ progressByLevel[3] }/> }
                { expandedSpecs.length > 0 &&
                  <div className={ styles.specs + ' ' + styles.expanded }>
                    { expandedSpecs.map((spec) =>
                      <VisualizationBlock
                        key={ spec.id }
                        spec={ spec }
                        className='expanded'
                        fieldNameToColor={ fieldNameToColor }
                        filteredVisualizationTypes={ filteredVisualizationTypes }
                        exportedSpecs={ exportedSpecs }
                        onClick={ this.onClickVisualization }
                        saveVisualization={ this.saveVisualization }
                        showStats={ true }
                      />
                      )
                    }
                  </div>
                }
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
    exportedSpecs
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
  createExportedSpec
})(ExploreView);
