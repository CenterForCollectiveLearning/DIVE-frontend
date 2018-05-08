import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import Number from '../../Base/Number';

export default class AnovaTable extends Component {

  render() {
    const { anovaData } = this.props;

    console.log('In AnovaTable', anovaData.columnHeaders);

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: ["", ...anovaData.columnHeaders.slice(0, anovaData.columnHeaders.length - 2), 'Identical']
      },
      ...anovaData.stats.map(function(object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ object.field, ...object.stats.map((num) => <Number className={ styles.dataCell } value={ num } />) ]
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

AnovaTable.propTypes = {
  anovaData: PropTypes.object.isRequired
}
