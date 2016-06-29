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
    const { regressionResult, regressionType } = this.props;
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
        <div className={ styles.dataCell }>
          <div className={ styles.coefficient }>
            { context.getCoefficientString(property.coefficient, property.pValue, enabled) }
          </div>
          { enabled &&
            <div className={ styles.standardError }>
              ({ getRoundedString(property.standardError) })
            </div>
          }
        </div>
      );
    }
    console.log('regression type', regressionType)
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
          <div className={ styles.rSquaredAdjust }>{ regressionType == 'logistic' ? <div className="cmu">Pseudo</div> : null }<div className={ styles.r }>R</div><sup className="cmu">2</sup></div>,
          ...regressionResult.regressionsByColumn.map((column) =>
            <div className={ styles.footerCell }>{ getRoundedString(column.columnProperties.rSquaredAdj) }</div>
          )
        ]
      },
      {
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [
          <em className="cmu">{ regressionType == 'logistic' ? 'Log-likelihood' : 'DOF' }</em>,
          ...regressionResult.regressionsByColumn.map((column) =>
            <div className={ styles.footerCell }>{ regressionType == 'logistic' ? getRoundedString(column.columnProperties.llf) : getRoundedString(column.columnProperties.dof) }</div>
          )
        ]
      },
      {
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [
          <em className="cmu">{ regressionType == 'logistic' ? 'LL-null' : 'F' }</em>,
          ...regressionResult.regressionsByColumn.map((column) =>
            <div className={ styles.footerCell }>{ regressionType == 'logistic' ? getRoundedString(column.columnProperties.llnull) : getRoundedString(column.columnProperties.fTest) }</div>
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

    const llrPvalue = {
      rowClass: styles.footerRow,
      columnClass: styles.footerColumn,
      items: [
        <div className="cmu">LLR p-value</div>,
        ...regressionResult.regressionsByColumn.map((column) =>
          <div className={ styles.footerCell }>{ getRoundedString(column.columnProperties.llrPvalue) }</div>
        )
      ]
    }

    if(regressionType == 'logistic') {
      data.splice(7, 0, llrPvalue)
    }


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
