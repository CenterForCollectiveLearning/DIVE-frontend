import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import styles from './Compose.sass';

import { fetchDocuments } from '../../actions/ComposeActions';
import ComposePage from './ComposePage';
import ComposeEditor from './ComposeEditor';

export class NarrativeBasePage extends Component {
  render() {
    const { selectedDocument } = this.props;
    const { title, blocks, id } = selectedDocument;
    const documentTitle = title || 'DIVE Document';
    return (
      <DocumentTitle title={ documentTitle }>
        <div className={ `${ styles.fillContainer } ${ styles.composePageContainer }` }>
          <div className={ styles.storyContainer }>
            <ComposeEditor
              editable={ false }
              selectedDocument={ selectedDocument }
            />
          </div>
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { composeSelector } = state;

  const selectedDocument = {
    blocks: composeSelector.blocks,
    title: composeSelector.title,
    id: composeSelector.documentId
  };

  return { composeSelector, selectedDocument: selectedDocument };
}

export default connect(mapStateToProps, { fetchDocuments })(NarrativeBasePage);
