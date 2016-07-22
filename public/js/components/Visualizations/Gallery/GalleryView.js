import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { clearVisualization, fetchSpecs, selectSortingFunction, createExportedSpec } from '../../../actions/VisualizationActions';
import { fetchExportedVisualizationSpecs } from '../../../actions/ComposeActions';

import styles from '../Visualizations.sass';

import HeaderBar from '../../Base/HeaderBar';
import DropDownMenu from '../../Base/DropDownMenu';
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
      fetchSpecs(project.properties.id, datasetSelector.datasetId, gallerySelector.fieldProperties, gallerySelector.recommendations.types[0]);
    }

    clearVisualization();
  }

  componentDidUpdate(previousProps) {
    const { datasetSelector, datasets, project, specs, gallerySelector, exportedSpecs, fetchExportedVisualizationSpecs, fetchSpecs, fetchDatasets } = this.props;
    const datasetChanged = (datasetSelector.datasetId !== previousProps.datasetSelector.datasetId);
    const notLoadedAndNotFetching = (!specs.loaded && !specs.isFetching && !specs.error);
    const gallerySelectorChanged = (gallerySelector.updatedAt !== previousProps.gallerySelector.updatedAt);
    const projectChanged = (previousProps.project.properties.id !== project.properties.id);

    if (projectChanged || (project.properties.id && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded)))) {
      fetchDatasets(project.properties.id);
    }

    const fieldPropertiesSelected = gallerySelector.fieldProperties.find((prop) => prop.selected) != undefined;
    const specRecommendationLevelIncreasedLessThanMaxLevel = specs.recommendationLevel > previousProps.specs.recommendationLevel && specs.recommendationLevel < gallerySelector.recommendations.maxLevel;

    if (project.properties.id && datasetSelector.datasetId && gallerySelector.fieldProperties.length && !specs.isFetching) {
      if (datasetChanged || gallerySelectorChanged || notLoadedAndNotFetching) {
        fetchSpecs(project.properties.id, datasetSelector.datasetId, gallerySelector.fieldProperties, gallerySelector.recommendations.types[specs.recommendationLevel == null ? 0 : specs.recommendationLevel]);
      } else if (fieldPropertiesSelected && (specRecommendationLevelIncreasedLessThanMaxLevel || (specs.recommendationLevel != null && previousProps.specs.recommendationLevel == null))) {
        fetchSpecs(project.properties.id, datasetSelector.datasetId, gallerySelector.fieldProperties, gallerySelector.recommendations.types[specs.recommendationLevel == null ? 0 : specs.recommendationLevel + 1]);
      }
    }

    if (project.properties.id && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
      fetchExportedVisualizationSpecs(project.properties.id);
    }
  }

  onClickVisualization(specId) {
    const { project, datasetSelector, push } = this.props;
    push(`/projects/${ project.properties.id }/datasets/${ datasetSelector.datasetId }/visualize/builder/${ specId }`);
  }

  saveVisualization(specId, specData) {
    const { project, createExportedSpec } = this.props;
    createExportedSpec(project.properties.id, specId, specData, [], {}, true);
  }


  render() {
    const { specs, filters, datasets, datasetSelector, filteredVisualizationTypes, gallerySelector, exportedSpecs, selectSortingFunction } = this.props;

    var selectedFieldProperties = gallerySelector.fieldProperties
      .filter((property) => property.selected);

    const filteredSpecs = gallerySelector.specs.filter((spec) =>
      (filteredVisualizationTypes.length == 0) || filteredVisualizationTypes.some((filter) =>
        spec.vizTypes.indexOf(filter) >= 0
      )
    );

    const areFieldsSelected = selectedFieldProperties.length > 0;
    const baselineSpecs = filteredSpecs.filter((spec) => spec.recommendationType == 'baseline');
    const subsetSpecs = filteredSpecs.filter((spec) => spec.recommendationType == 'subset');
    const exactSpecs = filteredSpecs.filter((spec) => spec.recommendationType == 'exact');
    const expandedSpecs = filteredSpecs.filter((spec) => spec.recommendationType == 'expanded');

    return (
      <div className={ styles.specsContainer }>
        <div className={ styles.innerSpecsContainer }>
          <HeaderBar
            header={
              gallerySelector.title.map((construct, i) =>
                <span
                  key={ `construct-${ construct.type }-${ i }` }
                  className={ `${ styles.headerFragment } ${ styles[construct.type] }` }>
                  { construct.string }
                </span>
              )
            }
          />
          <div className={ styles.specContainer }>
            { !specs.isFetching && filteredSpecs.length == 0 &&
              <div className={ styles.watermark }>No visualizations</div>
            }
            { exactSpecs.length > 0 &&
              <div className={ styles.specSection }>
                <div className={ styles.blockSectionHeader }>
                  { areFieldsSelected &&
                    <span>
                      <div className={ styles.blockSectionHeaderTitle }>Exact Matches</div>
                        Including {
                          selectedFieldProperties.map((field) =>
                            <span key={ `span-exact-match-title-${ field.name }`} className={ `${ styles.exactTitleField }`}>
                              { field.name }
                            </span>
                          )
                        }
                    </span>
                  }
                  { !areFieldsSelected &&
                    <span>
                      <div className={ styles.blockSectionHeaderTitle }>Default Matches</div>
                      Summary of each field
                    </span>
                  }
                </div>
                <div className={ styles.specs + ' ' + styles.exact }>
                  { exactSpecs.map((spec) =>
                    <VisualizationBlock
                      key={ spec.id }
                      spec={ spec }
                      className='exact'
                      filteredVisualizationTypes={ filteredVisualizationTypes }
                      exportedSpecs={ exportedSpecs }
                      onClick={ this.onClickVisualization.bind(this) }
                      saveVisualization={ this.saveVisualization.bind(this) }
                      />
                    )
                  }
                </div>
              </div>
            }
            { subsetSpecs.length > 0 &&
              <div className={ styles.specSection }>
                <div className={ styles.blockSectionHeader }>
                  <div className={ styles.blockSectionHeaderTitle }>Close Matches</div>
                  Including two or more of {
                  selectedFieldProperties.map((field) =>
                    <span key={ `span-close-match-title-${ field.name }`} className={ `${ styles.subsetTitleField }`}>
                      { field.name }
                    </span>
                  )
                }</div>
                <div className={ styles.specs + ' ' + styles.subset }>
                  { subsetSpecs.map((spec) =>
                    <VisualizationBlock
                      key={ spec.id }
                      spec={ spec }
                      className='subset'
                      filteredVisualizationTypes={ filteredVisualizationTypes }
                      exportedSpecs={ exportedSpecs }
                      onClick={ this.onClickVisualization.bind(this) }
                      saveVisualization={ this.saveVisualization.bind(this) }
                      />
                    )
                  }
                </div>
              </div>
            }
            { !specs.isFetching && baselineSpecs.length > 1 && (selectedFieldProperties.length > 1 || selectedFieldProperties.length == 0)&&
              <div className={ styles.specSection }>
                <div className={ styles.blockSectionHeader }>
                  <span>
                    <div className={ styles.blockSectionHeaderTitle }>Individual Matches</div>
                    Including <strong>only</strong> {
                      selectedFieldProperties.map((field) =>
                        <span key={ `span-individual-match-title-${ field.name }`} className={ `${ styles.baselineTitleField }` }>
                          { field.name }
                        </span>
                      )
                    }
                  </span>
                </div>
                <div className={ styles.specs + ' ' + styles.baseline }>
                  { baselineSpecs.map((spec) =>
                    <VisualizationBlock
                      key={ spec.id }
                      spec={ spec }
                      className='baseline'
                      filteredVisualizationTypes={ filteredVisualizationTypes }
                      exportedSpecs={ exportedSpecs }
                      onClick={ this.onClickVisualization.bind(this) }
                      saveVisualization={ this.saveVisualization.bind(this) }
                      />
                    )
                  }
                </div>
              </div>
            }
            { expandedSpecs.length > 0 &&
              <div className={ styles.specSection }>
                <div className={ styles.blockSectionHeader }>
                  <div className={ styles.blockSectionHeaderTitle }>Expanded Matches</div>
                  Including {
                  selectedFieldProperties.map((field) =>
                    <span key={ `span-expanded-match-title-${ field.name }`} className={ `${ styles.expandedTitleField }`}>
                      { field.name }
                    </span>
                  )
                } with other fields</div>
                <div className={ styles.specs + ' ' + styles.expanded }>
                  { expandedSpecs.map((spec) =>
                    <VisualizationBlock
                      key={ spec.id }
                      spec={ spec }
                      className='expanded'
                      filteredVisualizationTypes={ filteredVisualizationTypes }
                      exportedSpecs={ exportedSpecs }
                      onClick={ this.onClickVisualization.bind(this) }
                      saveVisualization={ this.saveVisualization.bind(this) }
                      />
                    )
                  }
                </div>
              </div>
            }
            { specs.isFetching &&
              <div className={ styles.watermark }>
                { specs.progress != null ? specs.progress : 'Fetching visualizations…' }
              </div>
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
  const { project, filters, specs, gallerySelector, datasets, datasetSelector, exportedSpecs } = state;
  return {
    project,
    filters,
    specs,
    gallerySelector,
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
  selectDataset,
  clearVisualization,
  selectSortingFunction,
  createExportedSpec
})(GalleryView);
