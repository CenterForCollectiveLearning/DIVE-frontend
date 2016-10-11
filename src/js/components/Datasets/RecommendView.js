import _ from 'underscore';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetchDatasets } from '../../actions/DatasetActions';
import { clearVisualization, updateVisualizationStats, fetchSpecs, selectSortingFunction, createExportedSpec } from '../../actions/VisualizationActions';
import { fetchExportedVisualizationSpecs } from '../../actions/ComposeActions';
import { useWhiteFontFromBackgroundHex } from '../../helpers/helpers';

import styles from './DatasetRecommendation.sass'

import Loader from '../Base/Loader';
import HeaderBar from '../Base/HeaderBar';
import DropDownMenu from '../Base/DropDownMenu';
import ColoredFieldItems from '../Base/ColoredFieldItems';

export class RecommendView extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { datasetSelector, datasets, project, specs, recommendSelector, clearVisualization, fetchSpecs, fetchDatasets } = this.props;
    const notLoadedAndNotFetching = (!specs.loaded && !specs.isFetching && !specs.error);

    if (project.id && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(project.id);
    }
  }

  componentDidUpdate(previousProps) {
    const { datasetSelector, datasets, project, specs, recommendSelector, exportedSpecs, fetchExportedVisualizationSpecs, fetchSpecs, fetchDatasets } = this.props;
    const datasetChanged = (datasetSelector.datasetId !== previousProps.datasetSelector.datasetId);
    const notLoadedAndNotFetching = (!specs.loaded && !specs.isFetching && !specs.error);
    const recommendSelectorChanged = (recommendSelector.updatedAt !== previousProps.recommendSelector.updatedAt);
    const projectChanged = (previousProps.project.id !== project.id);
    const fieldPropertiesSelected = recommendSelector.fieldProperties.find((prop) => prop.selected) != undefined;
    const { isFetchingSpecLevel, loadedSpecLevel, recommendationTypes } = recommendSelector;

    if (projectChanged || (project.id && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded)))) {
      fetchDatasets(project.id);
    }
  }

  render() {
    return (
      <div className={ styles.recommendationMainPane }>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { project, filters, specs, recommendSelector, fieldProperties, datasets, datasetSelector, exportedSpecs } = state;
  return {
    project,
    filters,
    specs,
    recommendSelector,
    fieldNameToColor: fieldProperties.fieldNameToColor,
    datasets,
    datasetSelector,
    exportedSpecs
  }
}

export default connect(mapStateToProps, {
  push,
  fetchSpecs,
  fetchDatasets,
})(RecommendView);
