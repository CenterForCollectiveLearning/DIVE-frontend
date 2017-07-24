import _ from 'underscore';
import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Number from '../../Base/Number';
import BareDataGrid from '../../Base/BareDataGrid';

export default class RegressionTable extends Component {

  componentWillReceiveProps(nextProps) {
  }

  pValueThresholds = [
    { threshold: 0.5, symbol: '*' },
    { threshold: 0.01, symbol: '**' },
    { threshold:  0.001, symbol: '***' }
  ]

  getPValueString = (pValue) => {
    let pValueString = ''
    for ( var o of this.pValueThresholds ) {
      if (pValue < o.threshold) {
        pValueString = o.symbol;
      }
    }
    return pValueString;
  }

  render() {
    const { regressionResult, regressionType, preview } = this.props;
    const context = this;

    const allRegressedFields = regressionResult.fields.map(function (field){
      if (!field.values) {
        let formattedName = field.name;

        if (field.name.indexOf('np.log') > -1) {
          formattedName = field.name.slice(0, field.name.indexOf(' + np.min')).replace('np.log', 'log') + ')';
        }
        if (field.name.indexOf('** 2') > -1) {
          formattedName = <span>{ field.name.slice(0, -5) }<sup>2</sup></span>
        }

        // numeric
        return { ...field, formattedName: formattedName, enabled: true };

      } else if (field.values.length == 1) {
        // categorical binary
        return { name: field.name, formattedName: `${ field.name }: ${ field.values[0] }`, enabled: true };

      } else {
        // categorical fixed effects
        return { ...field, formattedName: field.name, enabled: true };
      }
    });


    const renderDataColumn = function(property, enabled) {
      return (
        <div className={ styles.dataCell }>
          { enabled &&
            <Number className={ styles.coefficient } value={ property.coefficient } suffix={ context.getPValueString(property.pValue ) }/>
          }
          { enabled &&
            <Number className={ styles.standardError } value={ property.standardError } prefix='(' suffix=')' />
          }
          { !enabled &&
            <span>✓</span>
          }
        </div>
      );
    }

    const regressionData = allRegressedFields.map(function(field) {

      if ( field.values && field.values.length > 1 ) {
        return {
          isNested: true,
          parentName: field.formattedName,
          children: field.values.map(function(fieldValue) {
            return new Object({
              rowClass: styles.dataRow,
              columnClass: styles.dataColumn,
              items: [ ( preview ? '✓' : fieldValue ), ...regressionResult.regressionsByColumn.map(function (column) {
                const property = column.regression.propertiesByField.find((property) => ((property.baseField == field.name) && (property.valueField == fieldValue)));
                if (!property) return '';

                if (preview) {
                  return '✓'
                } else {
                  return (renderDataColumn(property, field.enabled));
                }
              }) ]
            })
          })
        }
      } else {
        return new Object({
          isNested: false,
          rowClass: styles.dataRow,
          columnClass: styles.dataColumn,
          placeholder: '✓',
          collapsed: true,
          items: [ ( preview ? '' : field.formattedName ), ...regressionResult.regressionsByColumn.map(function (column) {
            const property = column.regression.propertiesByField.find((property) => property.baseField == field.name);
            if (!property) return '';

            if (preview) {
              return '✓'
            } else {
              return (renderDataColumn(property, field.enabled));
            }
          }) ]
        })
      }
    });

    const baseData = [
      {
        rowClass: styles.tableHeaderRow,
        columnClass: styles.tableHeaderColumn,
        items: preview ? _.range(regressionResult.numColumns + 1).map((i) => <div></div>) : [ 'Variables', ..._.range(regressionResult.numColumns).map((i) => <div className={ styles.tableCell }>({ i + 1 })</div>)]
      },
      ...regressionData
    ]


    const regressionMeasures = {
      linear: [
        { name: 'N', prop: 'dof' },
        { name: 'F', prop: 'fTest' },
        { name: 'BIC', prop: 'bic' }
      ],
      logistic: [
        { name: 'Log-likelihood', prop: 'llf' },
        { name: 'LL-null', prop: 'llnull' },
        { name: 'LLR p-value', prop: 'llrPvalue' },
        { name: 'BIC', prop: 'bic' }
      ]
    }

    const additionalData  = [
      {
        rowClass: styles.dataRow,
        columnClass: styles.dataColumn,
        items: [
          <div className={ styles.constant }>Constant</div>,
          ...regressionResult.regressionsByColumn.map((column) => 
            renderDataColumn(column.regression.constants, true)
          )
        ]
      },    
      {
        rowClass: styles.footerRow,
        columnClass: styles.footerColumn,
        items: [
          <div className={ styles.rSquaredAdjust }>{ regressionType == 'logistic' ? <div className="cmu">Pseudo</div> : null }<div className={ styles.r }>R</div><sup className="cmu">2</sup></div>,
          ...regressionResult.regressionsByColumn.map((column) =>
            <Number className={ styles.footerCell } value={ column.columnProperties.rSquaredAdj } />
          )
        ]
      },
      {
        isNested: true,
        parentName: 'Model Properties',
        placeholder: '...',
        initialCollapse: true,
        children: regressionMeasures[regressionType].map(function(val, key) {
          return new Object({
            rowClass: `${ styles.footerRow } ${ styles.nestedFooterRow }`,
            columnClass: `${ styles.footerColumn} ${ styles.nestedFooterColumn }`,
            items: [
              <div className="cmu">{ val.name }</div>,
              ...regressionResult.regressionsByColumn.map((column) =>
                <Number className={ styles.footerCell } value={ column.columnProperties[val.prop] } />
              )
            ]
          })
        })
      }

    ]

    const data = preview ? baseData : baseData.concat(additionalData);

    return (
      <div className={ styles.regressionTable }>
        <BareDataGrid data={ data } preview={ preview }/>     
        <div className={ styles.pValueLegend }>
          { this.pValueThresholds.map((pValueThreshold) =>
            <span>{ `${ pValueThreshold.symbol } p < ${ pValueThreshold.threshold }` }</span>
          )}
        </div>
      </div>
    );
  }
}

RegressionTable.defaultProps = {
  preview: false
}

RegressionTable.propTypes = {
  regressionResult: PropTypes.object.isRequired,
  regressionType: PropTypes.string.isRequired,
  preview: PropTypes.bool
}
