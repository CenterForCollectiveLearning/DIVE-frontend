import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-react-router';
import styles from './Compose.sass';

import ComposeSidebar from './ComposeSidebar';
import ComposeView from './ComposeView';
import { selectDocument } from '../../actions/ComposeActions';

export class ComposePage extends Component {
  componentWillMount() {
    this.props.selectDocument(this.props.params.documentId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.documentId != nextProps.params.documentId) {
      this.props.selectDocument(nextProps.params.documentId);
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
  return {};
}

export default connect(mapStateToProps, { selectDocument })(ComposePage);
