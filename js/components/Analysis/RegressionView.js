import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Analysis.sass';

export class RegressionView extends Component {
  render() {
    return (
      <div className={ styles.regressionViewContainer }>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps, { })(RegressionView);
