import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';

export default class ComparisonTableOneD extends Component {

  render() {
    const { comparisonResult, comparisonVariableNames } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [...comparisonResult.columnHeaders.map((e) => <div className={ styles.tableCell }>{ e }</div>) ]
      },
      ...comparisonResult.rows.map(function(row_object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumnOneD,
          items: [ row_object.field,  <div className={ styles.tableCell }>{ row_object.value }</div> ]
        })
      })
    ];

    if (comparisonResult.columnTotal) {
      data.push({
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [ 'Column Total',  <div className={ styles.tableCell }>{ comparisonResult.columnTotal }</div> ]
      })
    }

    return (
      <div className={ styles.aggregationTable }>
        <div className={ styles.columnFieldLabel }>{ comparisonVariableNames[0] }</div>
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
