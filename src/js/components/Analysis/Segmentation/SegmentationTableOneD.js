import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';

import { getRoundedString } from '../../../helpers/helpers';

export default class SegmentationTableOneD extends Component {

  render() {
    const { segmentationResult, segmentationVariableNames } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [
          <div className={ styles.tableCell + ' ' + styles.segmentationTableHeaderCell }>{ segmentationVariableNames[0] }</div>,
          <div className={ styles.tableCell + ' ' + styles.segmentationTableHeaderCell }>{ "Total" }</div>
        ]
      },
      ...segmentationResult.rows.map(function(row_object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumnOneD,
          items: [ row_object.field,  <div className={ styles.tableCell }>{ getRoundedString(row_object.value, 2, true) }</div> ]
        })
      })
    ];

    if (segmentationResult.columnTotal) {
      data.push({
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [ 'Column Total',  <div className={ styles.tableCell }>{ getRoundedString(segmentationResult.columnTotal, 2, true) }</div> ]
      })
    }

    return (
      <div className={ styles.segmentationTable }>
        <div className={ styles.gridWithRowFieldLabel }>
          <BareDataGrid data={ data }/>
        </div>
      </div>
    );
  }
}

SegmentationTableOneD.propTypes = {
  segmentationResult: PropTypes.object.isRequired,
  segmentationVariableNames: PropTypes.array.isRequired,
}
