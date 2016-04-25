import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import styles from './Compose.sass';

import { fetchDatasets } from '../../actions/DatasetActions';
import { fetchDocuments, fetchExportedVisualizationSpecs } from '../../actions/ComposeActions';
import ComposePage from './ComposePage';
import ComposeView from './ComposeView';

export class ComposeBasePage extends Component {
  componentWillMount() {
    const { params, project, datasetSelector, datasets, documents, exportedSpecs, replace, fetchDatasets, fetchDocuments, fetchExportedVisualizationSpecs } = this.props;

    if (project.properties.id && !datasetSelector.loaded && !datasets.isFetching) {
      fetchDatasets(project.properties.id);
    }

    if (project.properties.id && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
      fetchExportedVisualizationSpecs(project.properties.id);
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
    const { params, composeSelector, project, datasetSelector, datasets, documents, exportedSpecs, replace, push, fetchDatasets, fetchDocuments, fetchExportedVisualizationSpecs } = nextProps;

    if (project.properties.id && !datasetSelector.loaded && !datasets.isFetching) {
      fetchDatasets(project.properties.id);
    }

    if (project.properties.id && exportedSpecs.items.length == 0 && !exportedSpecs.loaded && !exportedSpecs.isFetching) {
      fetchExportedVisualizationSpecs(project.properties.id);
    }

    if (!params.documentId && documents.items.length > 0) {
      replace(`/projects/${ params.projectId }/compose/${ documents.items[0].id }`);
    }

    if (composeSelector.documentId != this.props.composeSelector.documentId && composeSelector.documentId != params.documentId) {
      push(`/projects/${ params.projectId }/compose/${ composeSelector.documentId }`);
    }

  }

  render() {
    const { selectedDocument, projectTitle } = this.props;
    const composeTitle = 'COMPOSE' + ( projectTitle ? ` | ${ projectTitle }` : '' )
    return (
      <DocumentTitle title={ composeTitle }>
        <div className={ `${ styles.fillContainer } ${ styles.composePageContainer }` }>
          <div className={ `${ styles.fillContainer } ${ styles.composeContentContainer }` }>
            <ComposeView editable={ true } selectedDocument={ selectedDocument } />
          </div>
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { documents, composeSelector, exportedSpecs, project, datasetSelector, datasets } = state;
  const selectedDocument = {
    blocks: composeSelector.blocks,
    title: composeSelector.title,
    id: composeSelector.documentId
  };

  return { documents, composeSelector, exportedSpecs, project, datasetSelector, datasets, selectedDocument: selectedDocument, projectTitle: project.properties.title };
}

export default connect(mapStateToProps, { fetchDocuments, fetchExportedVisualizationSpecs, fetchDatasets, push, replace })(ComposeBasePage);
