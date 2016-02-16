import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-react-router';
import styles from './Compose.sass';

import ComposePage from './ComposePage';
import ComposeToolbar from './ComposeToolbar';
import ComposeSidebar from './ComposeSidebar';
import ComposeView from './ComposeView';

export class ComposeBasePage extends Component {
  componentWillMount() {
    const documents = this.props.documents
    if (documents.items.length > 0) {
      const firstDocumentId = documents.items[0].id;
      console.log('firstDocumentId', firstDocumentId);
      this.props.replaceState(null, `/projects/${ this.props.params.projectId }/datasets/${ this.props.params.datasetId }/compose/${ firstDocumentId }`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { documents, params, replaceState } = nextProps;
    if (documents.items.length > 0) {
      const firstDocumentId = documents.items[0].id;
      replaceState(null, `/projects/${ params.projectId }/datasets/${ params.datasetId }/compose/${ firstDocumentId }`);
    }
  }

  render() {
    return (
      <div className={ `${ styles.fillContainer } ${ styles.composePageContainer }` }>
        <div className={ `${ styles.fillContainer } ${ styles.composeContentContainer }` }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { documents } = state;
  return { documents };
}

export default connect(mapStateToProps, { replaceState })(ComposeBasePage);
