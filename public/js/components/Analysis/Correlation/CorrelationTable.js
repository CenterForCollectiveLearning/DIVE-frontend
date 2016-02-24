import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import { getRoundedString } from '../../../helpers/helpers';

export default class CorrelationTable extends Component {

  render() {
    const { correlationResult } = this.props;

    const renderDataColumn = function(property) {
      return (
        <div>
          <div className={ styles.dataCell + ' ' + styles.coefficient }>
            { getRoundedString(property[0], 2, true) }
          </div>
          <div className={ styles.dataCell + ' ' + styles.standardError }>
            ({ getRoundedString(property[1], 2, true) })
          </div>
        </div>
      );
    }

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: ["", ...correlationResult.headers.map((column) => <div className={ styles.tableCell }>{ column }</div>) ]
      },
      ...correlationResult.rows.map(function(row) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ row.field, ...row.data.map(function(column){
            if (column[0] == null) { return "";}
            return (renderDataColumn(column));
          })]
        })
      })
    ];

    return (
      <div className={ styles.aggregationTable }>
        <div className={ styles.gridWithRowFieldLabel }>
          <BareDataGrid data={ data }/>
        </div>
      </div>
    );
  }
}

CorrelationTable.propTypes = {
  correlationResult: PropTypes.object.isRequired
}
