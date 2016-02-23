import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-react-router';
import styles from './Compose.sass';

import { fetchDocuments } from '../../actions/ComposeActions';
import ComposePage from './ComposePage';
import ComposeSidebar from './ComposeSidebar';
import ComposeView from './ComposeView';

export class NarrativeBasePage extends Component {
  render() {
    return (
      <div className={ `${ styles.fillContainer } ${ styles.composePageContainer }` }>
        <div className={ `${ styles.fillContainer } ${ styles.composeContentContainer }` }>
          <ComposeView editable={ false } />
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

export default connect(mapStateToProps, { fetchDocuments, pushState, replaceState })(NarrativeBasePage);
