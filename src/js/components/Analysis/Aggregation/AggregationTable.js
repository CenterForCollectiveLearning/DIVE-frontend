import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import Number from '../../Base/Number';

export default class AggregationTable extends Component {

  render() {
    const { aggregationResult, aggregationVariablesNames, preview } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ '', ...aggregationResult.columnHeaders.map(function(column) {
          return <div className={ styles.tableCell }>{ preview ? '' : column }</div>
        })]
      },
      ...aggregationResult.rows.map(function(row) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ (preview ? '' : row.field), ...row.values.map(function(column) {
            return ( preview ? <span/> : <Number className={ styles.dataCell } value={ column } />);
          })]
        })
      })
    ];

    if (aggregationResult.columnTotals) {
      data.push({
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [ (preview ? '' : 'Column Totals'), ...aggregationResult.columnTotals.map((column) => <div className={ styles.footerCell }>{ preview ? '' : column }</div>) ]
      })
    }

    return (
      <div className={ styles.aggregationTable }>
        { preview && <BareDataGrid data={ data }/> }
        { !preview &&
          <div>
            <div className={ styles.columnFieldLabel }>{ aggregationVariablesNames[0] }</div>
            <div className={ styles.gridWithRowFieldLabel }>
              <div className={ styles.rowFieldLabel }>{ aggregationVariablesNames[1] }</div>
              <BareDataGrid data={ data } preview={ preview }/>
            </div>
          </div>
        }
      </div>
    );
  }
}

AggregationTable.propTypes = {
  aggregationResult: PropTypes.object.isRequired,
  aggregationVariablesNames: PropTypes.array.isRequired,
  preview: PropTypes.bool
}

AggregationTable.defaultProps = {
  preview: false,
}
