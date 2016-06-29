import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import { getRoundedString } from '../../../helpers/helpers';

export default class AnovaTable extends Component {

  render() {
    const { anovaData } = this.props;

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: ["", ...anovaData.columnHeaders]
      },
      ...anovaData.stats.map(function(object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ object.field, ...object.stats.map((num) => <div className={ styles.dataCell }>{ getRoundedString(num, 2, true) }</div>) ]
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
