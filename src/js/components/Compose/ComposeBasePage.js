import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import styles from './Compose.sass';

import { fetchDatasets } from '../../actions/DatasetActions';
import {
  fetchDocuments,
  fetchExportedVisualizationSpecs,
  fetchExportedAnalyses
} from '../../actions/ComposeActions';
import ComposePage from './ComposePage';
import ComposeView from './ComposeView';

export class ComposeBasePage extends Component {
  componentWillMount() {
    const { params, project, datasetSelector, datasets, documents, exportedSpecs, exportedAnalyses, replace, fetchDatasets, fetchDocuments, fetchExportedVisualizationSpecs, fetchExportedAnalyses } = this.props;

    if (project.id) {
      if (!datasetSelector.loaded && !datasets.isFetching) {
        fetchDatasets(project.id);
      }

      if (exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
        fetchExportedVisualizationSpecs(project.id);
      }

      if (!exportedAnalyses.loaded && !exportedAnalyses.isFetching) {
        fetchExportedAnalyses(project.id);
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
    const { params, composeSelector, project, datasetSelector, datasets, documents, exportedSpecs, exportedAnalyses, replace, push, fetchDatasets, fetchDocuments, fetchExportedVisualizationSpecs, fetchExportedAnalyses } = nextProps;

    if (project.id) {
      if (!datasetSelector.loaded && !datasets.isFetching) {
        fetchDatasets(project.id);
      }

      if (exportedSpecs.items.length == 0 && !exportedSpecs.loaded && !exportedSpecs.isFetching) {
        fetchExportedVisualizationSpecs(project.id);
      }

      if (!exportedAnalyses.loaded && !exportedAnalyses.isFetching) {
        fetchExportedAnalyses(project.id);
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
  const { documents, composeSelector, exportedSpecs, exportedAnalyses, project, datasetSelector, datasets } = state;
  const selectedDocument = {
    blocks: composeSelector.blocks,
    title: composeSelector.title,
    id: composeSelector.documentId
  };

  return {
    documents,
    composeSelector,
    exportedSpecs,
    exportedAnalyses, 
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
  fetchExportedAnalyses,
  fetchDatasets,
  push,
  replace
})(ComposeBasePage);
