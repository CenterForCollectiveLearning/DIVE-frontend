import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';

export default class ComparisonTable extends Component {

  render() {
    const { comparisonResult, comparisonVariableNames } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ '', ...comparisonResult.columnHeaders.map((e) => <div className={ styles.tableCell }>{ e }</div>) ]
      },
      ...comparisonResult.rows.map(function(row_object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ row_object.field, ...row_object.values.map((v) => <div className={ styles.tableCell }>{ v }</div>) ]
        })
      })
    ];

    if (comparisonResult.columnTotals) {
      data.push({
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [ 'Column Totals', ...comparisonResult.columnTotals.map((v) => <div className={ styles.tableCell }>{ v }</div>) ]
      })
    }

    return (
      <div className={ styles.comparisonTable }>
        <div className={ styles.columnFieldLabel }>{ comparisonVariableNames[0] }</div>
        <div className={ styles.gridWithRowFieldLabel }>
          <div className={ styles.rowFieldLabel }>{ comparisonVariableNames[1] }</div>
          <BareDataGrid data={ data }/>
        </div>
      </div>
    );
  }
}

ComparisonTable.propTypes = {
  comparisonResult: PropTypes.object.isRequired,
  comparisonVariableNames: PropTypes.array.isRequired,
}
