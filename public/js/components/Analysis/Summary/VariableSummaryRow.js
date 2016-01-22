import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import SummaryTable from './SummaryTable';
import ColumnChart from '../../Visualizations/Charts/ColumnChart'

export default class VariableSummaryCard extends Component {
  render() {
    const { stats, columnHeaders, variableName, vizData } = this.props;

    return (
      <div className={ styles.summaryVariableColumn}>
        <div className= {styles.summaryVariableRow} > <div className= { styles.summaryVariableHeaderCell }> <div>{variableName}</div> </div> </div>
        <div className={ styles.summaryVariableRow }>
          <div className= { styles.summaryEmptyCell}> <ColumnChart data={vizData} chartId={0} /> </div>
          <div className= { styles.summaryEmptyCell}> <SummaryTable stats={stats} columnHeaders={columnHeaders} /> </div>
        </div>
      </div>
    );
  }
}

// RegressionTableCard.propTypes = {
//   dependentVariableName: PropTypes.string,
//   independentVariableNames: PropTypes.object.isRequired
// }
