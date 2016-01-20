import _ from 'underscore';
import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import BareDataGrid from '../../Base/BareDataGrid';
import { getRoundedString } from '../../../helpers/helpers';

export default class RegressionTable extends Component {
  constructor(props) {
    super(props);

    this.getCoefficientString = this.getCoefficientString.bind(this);
  }

  componentWillReceiveProps(nextProps) {
  }

  getCoefficientString(coefficient, pValue, enabled) {
    if (!enabled) {
      return '×';
    }

    var pValueString = ''
    if (pValue < 0.01){
      pValueString = '***';
    } else if (pValue < 0.05) {
      pValueString = '**';
    } else if (pValue < 0.1) {
      pValueString = ''
    }
    return getRoundedString(coefficient) + pValueString;
  }

  render() {
    const { regressionResult } = this.props;
    const context = this;

    const allRegressedFields = regressionResult.fields.map(function (field){
      if (!field.values) {
        // numeric
        return { ...field, formattedName: field.name, enabled: true };

      } else if (field.values.length == 1) {
        // categorical binary
        return { name: field.name, formattedName: `${ field.name }: ${ field.values[0] }`, enabled: true };

      } else {
        // categorical fixed effects
        return { ...field, formattedName: field.name, enabled: false };

      }
    });


    const renderDataColumn = function(property, enabled) {
      return (
        <div>
          <div className={ styles.dataCell + ' ' + styles.coefficient }>
            { context.getCoefficientString(property.coefficient, property.pValue, enabled) }
          </div>
          { enabled &&
            <div className={ styles.dataCell + ' ' + styles.standardError }>
              ({ getRoundedString(property.standardError) })
            </div>
          }
        </div>
      );
    }

    const data = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: [ 'Variables', ..._.range(regressionResult.numColumns).map((i) => <div className={ styles.tableCell }>({ i + 1 })</div>)]
      },
      ...allRegressedFields.map(function (field) {
        return new Object({
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          items: [ field.formattedName, ...regressionResult.regressionsByColumn.map(function (column) {
            const property = column.regression.propertiesByField.find((property) => property.baseField == field.name);
            if (!property) return '';
            return (renderDataColumn(property, field.enabled));
          }) ]
        })
      }),
      {
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [
          <div className={ styles.rSquaredAdjust }><div className={ styles.r }>R</div><sup className="cmu">2</sup></div>,
          ...regressionResult.regressionsByColumn.map((column) =>
            <div className={ styles.footerCell }>{ getRoundedString(column.columnProperties.rSquaredAdj) }</div>
          )
        ]
      },
      {
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [
          <em className="cmu">F</em>,
          ...regressionResult.regressionsByColumn.map((column) =>
            <div className={ styles.footerCell }>{ getRoundedString(column.columnProperties.fTest) }</div>
          )
        ]
      },
      {
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [
          <div className="cmu">BIC</div>,
          ...regressionResult.regressionsByColumn.map((column) =>
            <div className={ styles.footerCell }>{ getRoundedString(column.columnProperties.bic) }</div>
          )
        ]
      }
    ];

    return (
      <div className={ styles.regressionTable }>
        <BareDataGrid data={ data }/>
      </div>
    );
  }
}

RegressionTable.propTypes = {
  regressionResult: PropTypes.object.isRequired
}
