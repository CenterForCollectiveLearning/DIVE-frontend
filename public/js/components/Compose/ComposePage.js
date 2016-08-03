import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchDatasets } from '../../actions/DatasetActions';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';
import { selectDocument } from '../../actions/ComposeActions';

export class ComposePage extends Component {
  componentWillMount() {
    const { projectId, datasetId, datasets, fieldProperties, fetchFieldPropertiesIfNeeded, selectDocument, params, fetchDatasets } = this.props;
    const { documentId } = params;

    selectDocument(documentId);

    if (projectId && (!datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    if (projectId && datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(projectId, datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, projectId, datasets, datasetId, fieldProperties, selectDocument } = this.props;
    const { projectId: nextProjectId, datasetId: nextDatasetId, params: nextParams, fetchFieldPropertiesIfNeeded } = nextProps;

    const datasetIdChanged = nextDatasetId != datasetId;

    if (params.documentId != nextParams.documentId) {
      selectDocument(nextParams.documentId);
    }

    if (nextProjectId && nextDatasetId && (datasetIdChanged || !fieldProperties.items.length) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(params.projectId, nextDatasetId);
    }
  }

  render() { return (<div></div>) }
}

function mapStateToProps(state) {
  const { project, datasetSelector, fieldProperties, datasets, regressionSelector } = state;

  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    datasets,
    fieldProperties,
    regressionSelector
  };
}

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectDocument, fetchDatasets })(ComposePage);
