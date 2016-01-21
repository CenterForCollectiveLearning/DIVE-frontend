import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import SummaryTable from './SummaryTable';

export default class VariableSummaryCard extends Component {
  render() {
    const { stats, columnHeaders, variableName } = this.props;

    return (
      <div className={ styles.summaryVariableRow }>
        <div className= { styles.summaryVariableHeaderCell }> <div>{variableName}</div> </div>
        <div className= { styles.summaryEmptyCell}> <SummaryTable stats={stats} columnHeaders={columnHeaders} /> </div>
      </div>
    );
  }
}

// RegressionTableCard.propTypes = {
//   dependentVariableName: PropTypes.string,
//   independentVariableNames: PropTypes.object.isRequired
// }
