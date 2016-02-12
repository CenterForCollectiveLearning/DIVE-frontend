import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-react-router';
import styles from './Compose.sass';

import ComposeSidebar from './ComposeSidebar';
import ComposeView from './ComposeView';

export class ComposePage extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
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

export default connect(mapStateToProps, { replaceState })(ComposePage);
