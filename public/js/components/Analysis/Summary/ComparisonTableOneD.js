import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';

import { getRoundedString } from '../../../helpers/helpers';

export default class ComparisonTableOneD extends Component {

  render() {
    const { comparisonResult, comparisonVariableNames } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [
          <div className={ styles.tableCell + ' ' + styles.comparisonTableHeaderCell }>{ comparisonVariableNames[0] }</div>,
          <div className={ styles.tableCell + ' ' + styles.comparisonTableHeaderCell }>{ "Total" }</div>
        ]
      },
      ...comparisonResult.rows.map(function(row_object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumnOneD,
          items: [ row_object.field,  <div className={ styles.tableCell }>{ getRoundedString(row_object.value, 2, true) }</div> ]
        })
      })
    ];

    if (comparisonResult.columnTotal) {
      data.push({
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [ 'Column Total',  <div className={ styles.tableCell }>{ getRoundedString(comparisonResult.columnTotal, 2, true) }</div> ]
      })
    }

    return (
      <div className={ styles.aggregationTable }>
        <div className={ styles.gridWithRowFieldLabel }>
          <BareDataGrid data={ data }/>
        </div>
      </div>
    );
  }
}

ComparisonTableOneD.propTypes = {
  comparisonResult: PropTypes.object.isRequired,
  comparisonVariableNames: PropTypes.array.isRequired,
}
