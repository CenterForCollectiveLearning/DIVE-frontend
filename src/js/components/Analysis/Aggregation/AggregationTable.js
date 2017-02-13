import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import Number from '../../Base/Number';

export default class AggregationTable extends Component {

  render() {
    const { aggregationResult, aggregationIndependentVariableNames } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ '', ...aggregationResult.columnHeaders.map((column) => <div className={ styles.tableCell }>{ column }</div>) ]
      },
      ...aggregationResult.rows.map(function(row) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ row.field, ...row.values.map((column) => <Number className={ styles.dataCell } value={ column } />) ]
        })
      })
    ];

    if (aggregationResult.columnTotals) {
      data.push({
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [ 'Column Totals', ...aggregationResult.columnTotals.map((column) => <div className={ styles.footerCell }>{ column }</div>) ]
      })
    }

    return (
      <div className={ styles.aggregationTable }>
        <div className={ styles.columnFieldLabel }>{ aggregationIndependentVariableNames[0] }</div>
        <div className={ styles.gridWithRowFieldLabel }>
          <div className={ styles.rowFieldLabel }>{ aggregationIndependentVariableNames[1] }</div>
          <BareDataGrid data={ data }/>
        </div>
      </div>
    );
  }
}

AggregationTable.propTypes = {
  aggregationResult: PropTypes.object.isRequired,
  aggregationIndependentVariableNames: PropTypes.array.isRequired,
}
