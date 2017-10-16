import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import Number from '../../Base/Number';

export default class AggregationTableOneD extends Component {

  render() {
    const { aggregationResult, aggregationVariablesNames } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [
          <div className={ styles.tableCell + ' ' + styles.aggregationTableHeaderCell }>{ aggregationVariablesNames[0] }</div>,
          <div className={ styles.tableCell + ' ' + styles.aggregationTableHeaderCell }>{ "Total" }</div>
        ]
      },
      ...aggregationResult.rows.map(function(row_object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumnOneD,
          items: [ row_object.field, <Number className={ styles.tableCell } value={ row_object.value } /> ]
        })
      })
    ];

    if (aggregationResult.columnTotal) {
      data.push({
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [ 'Column Total', <Number className={ styles.tableCell } value={ aggregationResult.columnTotal } /> ]
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
  aggregationVariablesNames: PropTypes.array.isRequired,
}
