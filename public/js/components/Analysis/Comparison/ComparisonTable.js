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

    const renderDataColumn = function(context, property, enabled) {
      return (
        <div>
          <div className={ styles.dataCell + ' ' + styles.coefficient }>
            { context.getCoefficientString(property.coefficient, property.pValue, enabled) }
          </div>
          { enabled &&
            <div className={ styles.dataCell + ' ' + styles.standardError }>
              ({ context.getRoundedString(property.standardError) })
            </div>
          }
        </div>
      );
    }

    console.log('Comparison Rows', comparisonResult.rows)
    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ '', ...comparisonResult.columnHeaders.map((e) => <div className={ styles.tableCell }>({ e })</div>)]
      },
      ...comparisonResult.rows.map(function(field, values) {
        console.log(field, values);
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
