import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import { getRoundedString } from '../../../helpers/helpers';

export default class SummaryTable extends Component {

  render() {
    const { stats, columnHeaders } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ ...columnHeaders.map((column) => <div className={ styles.tableCell }>{ column }</div>) ]
      },
      {
        rowClass: styles.dataRow,
        columnClass: styles.dataColumn,
        items: [ ...stats.map((value) => <div className={ styles.dataCell }>{ getRoundedString(value, 2, true) }</div>) ]
      }
    ];

    return (
      <div className={ styles.aggregationTable }>
        <div className={ styles.columnFieldLabel }> Selected Statistics </div>
        <div className={ styles.gridWithRowFieldLabel }>
          <BareDataGrid data={ data }/>
        </div>
      </div>
    );
  }
}

SummaryTable.propTypes = {
  stats: PropTypes.array.isRequired,
  columnHeaders: PropTypes.array.isRequired,
}
