import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import { getRoundedString } from '../../../helpers/helpers';

export default class StatsTable extends Component {

  render() {
    const { numericalData } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ 'TEST', 'TEST-STATISTIC', 'P-VALUE' ]
      },
      ...numericalData.map(function(object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ object.test, ...object.values.map((num) => <div className={ styles.dataCell }>{ getRoundedString(num, 2, true) }</div>) ]
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

StatsTable.propTypes = {
  numericalData: PropTypes.array.isRequired
}
