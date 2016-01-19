import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import { getRoundedString } from '../../../helpers/helpers';

export default class ComparisonTable extends Component {

  render() {
    const { comparisonResult, comparisonVariableNames } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ '', ...comparisonResult.columnHeaders.map((column) => <div className={ styles.dataCell }>{ column }</div>) ]
      },
      ...comparisonResult.rows.map(function(row) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ row.field, ...row.values.map((column) => <div className={ styles.dataCell }>{ getRoundedString(column, 2, true) }</div>) ]
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
