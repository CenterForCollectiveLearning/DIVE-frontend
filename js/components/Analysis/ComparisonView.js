import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Analysis.sass';

export class ComparisonView extends Component {
  render() {
    return (
      <div className={ styles.comparisonViewContainer }>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps, { })(ComparisonView);
