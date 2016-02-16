import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replaceState, pushState } from 'redux-react-router';
import styles from './Compose.sass';

import { fetchDocuments } from '../../actions/ComposeActions';
import ComposePage from './ComposePage';
import ComposeSidebar from './ComposeSidebar';
import ComposeView from './ComposeView';

export class ComposeBasePage extends Component {
  componentWillMount() {
    // const documentSelector = this.props.documentSelector;
    // const documents = this.props.documents;
    // if (documents.items.length > 0) {
    //   const firstDocumentId = documents.items[0].id;
    //   this.props.replaceState(null, `/projects/${ this.props.params.projectId }/datasets/${ this.props.params.datasetId }/compose/${ firstDocumentId }`);
    // } else {
    //   fetchDocuments(this.props.params.projectId);
    //   this.props.replaceState(null, `/projects/${ this.props.params.projectId }/datasets/${ this.props.params.datasetId }/compose/${ firstDocumentId }`);
    // }
  }

  componentWillReceiveProps(nextProps) {
    // const { documents, documentSelector, params, replaceState } = nextProps;
    // console.log('BasePage ReceiveProps', documentSelector.documentId, this.props.documentSelector.documentId)
    // if (documentSelector.documentId != this.props.documentSelector.documentId) {
    //   pushState(null, `/projects/${ params.projectId }/compose/${ documentSelector.documentId }`);
    // }
    // if (documents.items.length > 0) {
    //   const firstDocumentId = documents.items[0].id;
    //   replaceState(null, `/projects/${ params.projectId }/datasets/${ params.datasetId }/compose/${ firstDocumentId }`);
    // } else {
    //   fetchDocuments(params.projectId);
    //   replaceState(null, `/projects/${ params.projectId }/datasets/${ params.datasetId }/compose/${ firstDocumentId }`);
    // }
  }

  render() {
    return (
      <div className={ `${ styles.fillContainer } ${ styles.composePageContainer }` }>
        <div className={ `${ styles.fillContainer } ${ styles.composeContentContainer }` }>
          <ComposeSidebar />
          <ComposeView />
        </div>
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { documents, documentSelector } = state;
  return { documents, documentSelector };
}

export default connect(mapStateToProps, { pushState, replaceState })(ComposeBasePage);
