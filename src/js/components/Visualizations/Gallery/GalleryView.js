import _ from 'underscore';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetchDatasets } from '../../../actions/DatasetActions';
import { clearVisualization, fetchSpecs, selectSortingFunction, createExportedSpec } from '../../../actions/VisualizationActions';
import { fetchExportedVisualizationSpecs } from '../../../actions/ComposeActions';
import { useWhiteFontFromBackgroundHex } from '../../../helpers/helpers';

import styles from '../Visualizations.sass';

import Loader from '../../Base/Loader';
import HeaderBar from '../../Base/HeaderBar';
import DropDownMenu from '../../Base/DropDownMenu';
import ColoredFieldItems from '../../Base/ColoredFieldItems';
import Visualization from '../Visualization';
import VisualizationBlock from './VisualizationBlock';

export class GalleryView extends Component {

  componentWillMount() {
    const { datasetSelector, datasets, project, specs, gallerySelector, clearVisualization, fetchSpecs, fetchDatasets } = this.props;
    const notLoadedAndNotFetching = (!specs.loaded && !specs.isFetching && !specs.error);

    if (project.properties.id && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(project.properties.id);
    }

    if (project.properties.id && datasetSelector.datasetId && gallerySelector.fieldProperties.length && notLoadedAndNotFetching) {
      for (var level of [ 0, 1, 2, 3 ]) {
        fetchSpecs(project.properties.id, datasetSelector.datasetId, gallerySelector.fieldProperties, gallerySelector.recommendationTypes[level]);
      }
    }

    clearVisualization();
  }

  componentDidUpdate(previousProps) {
    const { datasetSelector, datasets, project, specs, gallerySelector, exportedSpecs, fetchExportedVisualizationSpecs, fetchSpecs, fetchDatasets } = this.props;
    const datasetChanged = (datasetSelector.datasetId !== previousProps.datasetSelector.datasetId);
    const notLoadedAndNotFetching = (!specs.loaded && !specs.isFetching && !specs.error);
    const gallerySelectorChanged = (gallerySelector.updatedAt !== previousProps.gallerySelector.updatedAt);
    const projectChanged = (previousProps.project.properties.id !== project.properties.id);
    const fieldPropertiesSelected = gallerySelector.fieldProperties.find((prop) => prop.selected) != undefined;
    const { isFetchingSpecLevel, loadedSpecLevel, recommendationTypes } = gallerySelector;

    if (projectChanged || (project.properties.id && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded)))) {
      fetchDatasets(project.properties.id);
    }

    const numFields = gallerySelector.fieldProperties.filter((property) => property.selected).length;

    if (project.properties.id && datasetSelector.datasetId && gallerySelector.fieldProperties.length) {
      for (var i in isFetchingSpecLevel) {
        if (!(isFetchingSpecLevel[i] || loadedSpecLevel[i]) && gallerySelector.isValidSpecLevel[i]) {
          fetchSpecs(project.properties.id, datasetSelector.datasetId, gallerySelector.fieldProperties, gallerySelector.recommendationTypes[i]);
        }
      }
    }

    if (project.properties.id && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
      fetchExportedVisualizationSpecs(project.properties.id);
    }

    clearVisualization();
  }

  onClickVisualization = (specId) => {
    const { project, datasetSelector, push } = this.props;
    push(`/projects/${ project.properties.id }/datasets/${ datasetSelector.datasetId }/visualize/builder/${ specId }`);
  }

  saveVisualization = (specId, specData) => {
    const { project, createExportedSpec } = this.props;
    createExportedSpec(project.properties.id, specId, specData, [], {}, true);
  }


  render() {
    const { filters, datasets, fieldNameToColor, datasetSelector, filteredVisualizationTypes, gallerySelector, specs, exportedSpecs, selectSortingFunction } = this.props;
    const { fieldProperties, isFetchingSpecLevel, isValidSpecLevel } = gallerySelector;
    const { isFetching, progress, loaded } = specs;

    var selectedFieldProperties = fieldProperties
      .filter((property) => property.selected).map((property) => property.name);

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

    console.log('baseline:', baselineSpecs.length);
    console.log('subset:', subsetSpecs.length);
    console.log('exact:', exactSpecs.length);
    console.log('expanded:', expandedSpecs.length);

    let pageHeader;
    let helperText;
    if (areFieldsSelected) {
      pageHeader = <span>Visualizations of <ColoredFieldItems fields={ selectedFieldProperties } /></span>
      helperText = 'exploreSelectedFields'
    } else {
      pageHeader = <span>Default Recommended Visualizations</span>
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
            { isValidSpecLevel[0] &&
              <div className={ styles.specSection }>
                { areFieldsSelected &&
                  <HeaderBar
                    header={ 'Exact Matches' + ( exactSpecs.length ? ` (${ exactSpecs.length })` : '' ) }
                    helperText='exactMatches'
                    className={ styles.blockSectionHeader }
                    textClassName={ styles.blockSectionHeaderTitle }
                  />
                }
                { exactSpecs.length > 0 &&
                  <div className={ styles.specs + ' ' + styles.exact }>
                    { exactSpecs.map((spec) =>
                      <VisualizationBlock
                        key={ spec.id }
                        spec={ spec }
                        className='exact'
                        fieldNameToColor={ fieldNameToColor }
                        filteredVisualizationTypes={ filteredVisualizationTypes }
                        exportedSpecs={ exportedSpecs }
                        onClick={ this.onClickVisualization }
                        saveVisualization={ this.saveVisualization }
                        />
                      )
                    }
                  </div>
               }
              </div>
            }
            { isValidSpecLevel[1] &&
              <div className={ styles.specSection }>
                <HeaderBar
                  header={ 'Subset Matches' + ( subsetSpecs.length ? ` (${ subsetSpecs.length })` : '' ) }
                  helperText='closeMatches'
                  className={ styles.blockSectionHeader }
                  textClassName={ styles.blockSectionHeaderTitle }
                />
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
                        />
                      )
                    }
                  </div>
                }
              </div>
            }
            { isValidSpecLevel[2] &&
              <div className={ styles.specSection }>
                <HeaderBar
                  header={ 'Individual Matches' + ( baselineSpecs.length ? ` (${ baselineSpecs.length })` : '' ) }
                  helperText='individualMatches'
                  className={ styles.blockSectionHeader }
                  textClassName={ styles.blockSectionHeaderTitle }
                />
                { !isFetching && baselineSpecs.length > 0 && (selectedFieldProperties.length > 1 || selectedFieldProperties.length == 0) &&
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
                        />
                      )
                    }
                  </div>
                }
              </div>
            }
            { isValidSpecLevel[3] &&
              <div className={ styles.specSection }>
                <HeaderBar
                  header={ 'Expanded Matches' + ( expandedSpecs.length ? ` (${ expandedSpecs.length })` : '' ) }
                  helperText='expandedMatches'
                  className={ styles.blockSectionHeader }
                  textClassName={ styles.blockSectionHeaderTitle }
                />
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
                      />
                    )
                  }
                </div>
                }
              </div>
            }
            { isFetching &&
              <Loader text={ progress != null ? progress : 'Fetching visualizations…' } />
            }
          </div>
        </div>
      </div>
    );
  }
}

GalleryView.propTypes = {
  project: PropTypes.object.isRequired,
  specs: PropTypes.object.isRequired,
  gallerySelector: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  filteredVisualizationTypes: PropTypes.array.isRequired,
  exportedSpecs: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, filters, specs, gallerySelector, fieldProperties, datasets, datasetSelector, exportedSpecs } = state;
  return {
    project,
    filters,
    specs,
    gallerySelector,
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
  selectSortingFunction,
  createExportedSpec
})(GalleryView);
