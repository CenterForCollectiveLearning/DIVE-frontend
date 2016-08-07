import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';

import { getRoundedString } from '../../../helpers/helpers';

export default class AggregationTableOneD extends Component {

  render() {
    const { aggregationResult, aggregationVariableNames } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [
          <div className={ styles.tableCell + ' ' + styles.aggregationTableHeaderCell }>{ aggregationVariableNames[0] }</div>,
          <div className={ styles.tableCell + ' ' + styles.aggregationTableHeaderCell }>{ "Total" }</div>
        ]
      },
      ...aggregationResult.rows.map(function(row_object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumnOneD,
          items: [ row_object.field,  <div className={ styles.tableCell }>{ getRoundedString(row_object.value, 2, true) }</div> ]
        })
      })
    ];

    if (aggregationResult.columnTotal) {
      data.push({
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [ 'Column Total',  <div className={ styles.tableCell }>{ getRoundedString(aggregationResult.columnTotal, 2, true) }</div> ]
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

AggregationTableOneD.propTypes = {
  aggregationResult: PropTypes.object.isRequired,
  aggregationVariableNames: PropTypes.array.isRequired,
}
