import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import Number from '../../Base/Number';

export default class StatsTable extends Component {

  render() {
    const { numericalData } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ 'Test', 'Statistic', 'p-value' ]
      },
      ...numericalData.map(function(d) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ d.test, <Number className={ styles.dataCell } value={ d.values.statistic } />, <Number className={ styles.dataCell } value={ d.values.pvalue } /> ]
        })
      })
    ];

    return (
      <div className={ styles.aggregationTable }>
        <div className={ styles.gridWithRowFieldLabel }>
          <BareDataGrid data={ data }/>
        </div>
      </div>
    );
  }
}

StatsTable.propTypes = {
  numericalData: PropTypes.array.isRequired
}
