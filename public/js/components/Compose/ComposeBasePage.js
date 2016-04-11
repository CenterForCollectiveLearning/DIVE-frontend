import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-react-router';
import DocumentTitle from 'react-document-title';
import styles from './Compose.sass';

import { fetchDatasets } from '../../actions/DatasetActions';
import { fetchDocuments } from '../../actions/ComposeActions';
import ComposePage from './ComposePage';
import ComposeSidebar from './ComposeSidebar';
import ComposeView from './ComposeView';

export class ComposeBasePage extends Component {
  componentWillMount() {
    const { params, project, datasetSelector, datasets, documents, replaceState, fetchDatasets, fetchDocuments } = this.props;

    if (project.properties.id && !datasetSelector.loaded && !datasets.isFetching) {
      fetchDatasets(project.properties.id);
    }

    if (!params.documentId) {
      if (documents.items.length > 0) {
        replaceState(null, `/projects/${ params.projectId }/compose/${ documents.items[0].id }`);
      } else {
        fetchDocuments(params.projectId);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, composeSelector, project, datasetSelector, datasets, documents, replaceState, pushState, fetchDatasets, fetchDocuments } = nextProps;

    if (project.properties.id && !datasetSelector.loaded && !datasets.isFetching) {
      fetchDatasets(project.properties.id);
    }

    if (!params.documentId && documents.items.length > 0) {
      replaceState(null, `/projects/${ params.projectId }/compose/${ documents.items[0].id }`);
    }

    if (composeSelector.documentId != this.props.composeSelector.documentId && composeSelector.documentId != params.documentId) {
      pushState(null, `/projects/${ params.projectId }/compose/${ composeSelector.documentId }`);
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
            <ComposeSidebar />
          </div>
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { documents, composeSelector, project, datasetSelector, datasets } = state;
  const selectedDocument = documents.items.find((doc) => doc.id == composeSelector.documentId) || {};
  return { documents, composeSelector, project, datasetSelector, datasets, selectedDocument: selectedDocument, projectTitle: project.properties.title };
}

export default connect(mapStateToProps, { fetchDocuments, fetchDatasets, pushState, replaceState })(ComposeBasePage);
