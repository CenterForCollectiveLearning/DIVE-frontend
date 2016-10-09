import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import styles from './Compose.sass';

import { fetchDatasets } from '../../actions/DatasetActions';
import {
  fetchDocuments,
  fetchExportedVisualizationSpecs,
  fetchExportedRegressions,
  fetchExportedCorrelations
} from '../../actions/ComposeActions';
import ComposePage from './ComposePage';
import ComposeView from './ComposeView';

export class ComposeBasePage extends Component {
  componentWillMount() {
    const { params, project, datasetSelector, datasets, documents, exportedSpecs, exportedRegressions, exportedCorrelations, replace, fetchDatasets, fetchDocuments, fetchExportedVisualizationSpecs } = this.props;

    if (project.id) {
      if (!datasetSelector.loaded && !datasets.isFetching) {
        fetchDatasets(project.id);
      }

      if (exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
        fetchExportedVisualizationSpecs(project.id);
      }

      if (exportedRegressions.items.length == 0 && !exportedRegressions.loaded && !exportedRegressions.isFetching) {
        fetchExportedRegressions(project.id);
      }

      if (exportedCorrelations.items.length == 0 && !exportedCorrelations.loaded && !exportedCorrelations.isFetching) {
        fetchExportedCorrelations(project.id);
      }
    }

    if (!params.documentId) {
      if (documents.items.length > 0) {
        replace(`/projects/${ params.projectId }/compose/${ documents.items[0].id }`);
      } else {
        fetchDocuments(params.projectId);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, composeSelector, project, datasetSelector, datasets, documents, exportedSpecs, exportedRegressions, exportedCorrelations, replace, push, fetchDatasets, fetchDocuments, fetchExportedVisualizationSpecs, fetchExportedRegressions, fetchExportedCorrelations } = nextProps;

    if (project.id) {
      if (!datasetSelector.loaded && !datasets.isFetching) {
        fetchDatasets(project.id);
      }

      if (exportedSpecs.items.length == 0 && !exportedSpecs.loaded && !exportedSpecs.isFetching) {
        fetchExportedVisualizationSpecs(project.id);
      }

      if (exportedRegressions.items.length == 0 && !exportedRegressions.loaded && !exportedRegressions.isFetching) {
        fetchExportedRegressions(project.id);
      }

      if (exportedCorrelations.items.length == 0 && !exportedCorrelations.loaded && !exportedCorrelations.isFetching) {
        fetchExportedCorrelations(project.id);
      }

      if (!params.documentId && documents.items.length > 0) {
        replace(`/projects/${ params.projectId }/compose/${ documents.items[0].id }`);
      }
    }

    if (composeSelector.documentId != this.props.composeSelector.documentId && composeSelector.documentId != params.documentId) {
      push(`/projects/${ params.projectId }/compose/${ composeSelector.documentId }`);
    }

  }

  render() {
    const { selectedDocument, projectTitle } = this.props;
    const composeTitle = 'Compose' + ( projectTitle ? ` | ${ projectTitle }` : '' )
    return (
      <DocumentTitle title={ composeTitle }>
        <div className={ `${ styles.fillContainer } ${ styles.composePageContainer }` }>
          <ComposeView selectedDocument={ selectedDocument } />
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { documents, composeSelector, exportedSpecs, exportedRegressions, exportedCorrelations, project, datasetSelector, datasets } = state;
  const selectedDocument = {
    blocks: composeSelector.blocks,
    title: composeSelector.title,
    id: composeSelector.documentId
  };

  return {
    documents,
    composeSelector,
    exportedSpecs,
    exportedRegressions,
    exportedCorrelations,
    project,
    datasetSelector,
    datasets,
    selectedDocument: selectedDocument,
    projectTitle: project.title
  };
}

export default connect(mapStateToProps, {
  fetchDocuments,
  fetchExportedVisualizationSpecs,
  fetchExportedCorrelations,
  fetchExportedRegressions,
  fetchDatasets,
  push,
  replace
})(ComposeBasePage);
