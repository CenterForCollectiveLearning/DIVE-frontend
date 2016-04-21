import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-react-router';
import styles from './Compose.sass';

import { fetchDocuments } from '../../actions/ComposeActions';
import ComposePage from './ComposePage';
import ComposeSidebar from './ComposeSidebar';
import ComposeEditor from './ComposeEditor';

export class NarrativeBasePage extends Component {
  render() {
    const { selectedDocument } = this.props;
    return (
      <div className={ `${ styles.fillContainer } ${ styles.composePageContainer }` }>
        <div className={ `${ styles.fillContainer } ${ styles.composeContentContainer }` }>
          <div className={ styles.storyContainer }>
            <ComposeEditor editable={ false } selectedDocument={ selectedDocument }/>
          </div>
        </div>
        { this.props.children }
      </div>
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

export default connect(mapStateToProps, { fetchDocuments, pushState, replaceState })(NarrativeBasePage);
