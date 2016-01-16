import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';

export default class ComparisonTable extends Component {
  constructor(props) {
    super(props);

    this.getRoundedString = this.getRoundedString.bind(this);
  }

  componentWillReceiveProps(nextProps) {
  }

  getRoundedString(num, decimalPlaces=3) {
    if (num) {
      return Math.abs(parseFloat(num)) >=1 ?
        +parseFloat(num).toPrecision(decimalPlaces) :
        +parseFloat(num).toFixed(decimalPlaces);
    }

    return '';
  }

  render() {
    const { comparisonResult } = this.props;
    const context = this;

    console.log('Comparison Rows', comparisonResult.rows)
    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ '', ...comparisonResult.columnHeaders.map((e) => <div className={ styles.tableCell }>{ e }</div>) ]
      },
      ...comparisonResult.rows.map(function(row_object) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ row_object.field, ...row_object.values.map((v) => <div className={ styles.tableCell }>{ v }</div>) ]
        })
      })
    ];



    return (
      <div className={ styles.regressionTable }>
        <BareDataGrid data={ data }/>
      </div>
    );
  }
}

ComparisonTable.propTypes = {
  comparisonResult: PropTypes.object.isRequired
}
