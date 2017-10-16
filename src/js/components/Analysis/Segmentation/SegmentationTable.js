import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import { getRoundedString } from '../../../helpers/helpers';

export default class SegmentationTable extends Component {

  render() {
    const { segmentationResult, segmentationIndependentVariableNames } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ '', ...segmentationResult.columnHeaders.map((column) => <div className={ styles.tableCell }>{ column }</div>) ]
      },
      ...segmentationResult.rows.map(function(row) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ row.field, ...row.values.map((column) => <div className={ styles.dataCell }>{ getRoundedString(column, 2, true) }</div>) ]
        })
      })
    ];

    if (segmentationResult.columnTotals) {
      data.push({
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [ 'Column Totals', ...segmentationResult.columnTotals.map((column) => <div className={ styles.footerCell }>{ column }</div>) ]
      })
    }

    return (
      <div className={ styles.segmentationTable }>
        <div className={ styles.columnFieldLabel }>{ segmentationIndependentVariableNames[0] }</div>
        <div className={ styles.gridWithRowFieldLabel }>
          <div className={ styles.rowFieldLabel }>{ segmentationIndependentVariableNames[1] }</div>
          <BareDataGrid data={ data }/>
        </div>
      </div>
    );
  }
}

SegmentationTable.propTypes = {
  segmentationResult: PropTypes.object.isRequired,
  segmentationIndependentVariableNames: PropTypes.array.isRequired,
}
