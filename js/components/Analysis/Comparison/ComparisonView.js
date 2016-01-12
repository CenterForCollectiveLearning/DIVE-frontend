import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import ContingencyView from './ContingencyView';
import NumericalComparisonView from './NumericalComparisonView';

import styles from '../Analysis.sass';

export class ComparisonView extends Component {
  render() {
    return (
      <div className={ styles.comparisonViewContainer }>
        <NumericalComparisonView />
        <ContingencyView />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps, { })(ComparisonView);
