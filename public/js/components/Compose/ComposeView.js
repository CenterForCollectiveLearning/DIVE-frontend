import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

export class ComposeView extends Component {
  render() {
    return (
      <div className={ styles.composeViewContainer }>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps, { })(ComposeView);
