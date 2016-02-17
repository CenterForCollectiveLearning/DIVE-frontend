import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-react-router';
import styles from './Compose.sass';

import { fetchDocuments } from '../../actions/ComposeActions';
import ComposePage from './ComposePage';
import ComposeSidebar from './ComposeSidebar';
import ComposeView from './ComposeView';

export class ComposeBasePage extends Component {
  componentWillMount() {
    const { params, documents, replaceState, fetchDocuments } = this.props;

    if (!params.documentId) {
      if (documents.items.length > 0) {
        replaceState(null, `/projects/${ params.projectId }/compose/${ documents.items[0].id }`);
      } else {
        fetchDocuments(params.projectId);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, documents, replaceState, pushState, fetchDocuments, composeSelector } = nextProps;

    if (!params.documentId && documents.items.length > 0) {
      replaceState(null, `/projects/${ params.projectId }/compose/${ documents.items[0].id }`);
    }

    if (composeSelector.documentId != this.props.composeSelector.documentId && composeSelector.documentId != params.documentId) {
      pushState(null, `/projects/${ params.projectId }/compose/${ composeSelector.documentId }`);
    }

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
  const { documents, composeSelector } = state;
  return { documents, composeSelector };
}

export default connect(mapStateToProps, { fetchDocuments, pushState, replaceState })(ComposeBasePage);
