import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runCreateContingency } from '../../../actions/ComparisonActions';

import styles from '../Analysis.sass';

import DataGrid from '../../Base/DataGrid';
import HeaderBar from '../../Base/HeaderBar';
import ContingencyTableRow from './ContingencyTableRow';

import ColumnChart from '../../Visualizations/Charts/ColumnChart';

export class ContingencyView extends Component {

  componentWillReceiveProps(nextProps) {
    const { independentVariableNames, dependentVariableName, numericalDependentVariable, categoricalDependentVariable, numericalIndependentVariables, categoricalIndependentVariableNames, runCreateContingency} = this.props;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariableChanged = nextProps.dependentVariableName != dependentVariableName;

    if (nextProps.projectId && nextProps.datasetId && (nextProps.independentVariableNames.length == 2) && (dependentVariableChanged || independentVariablesChanged)) {
      runCreateContingency(nextProps.projectId, nextProps.datasetId, nextProps.numericalDependentVariable, nextProps.categoricalDependentVariable, nextProps.numericalIndependentVariables, nextProps.categoricalIndependentVariableNames);
    }

  }

  render() {
    const { contingencyResult, dependentVariableName, independentVariableNames, numericalIndependentVariables } = this.props;
    if (!(independentVariableNames.length == 2) || !(contingencyResult.result) || !(contingencyResult.result.row) || contingencyResult.result.row.length == 0) {
      return (
        <div></div>
      );
    }

    const consideredFields = contingencyResult.result.rowHeaders;
    const getRoundedString = function (num, decimalPlaces=3) {
      if (num) {
        return num >=1 ?
          +parseFloat(num).toFixed(decimalPlaces) :
          +parseFloat(num).toPrecision(decimalPlaces);
      }

      return '';
    };

    if (numericalIndependentVariables.length == 0){
      var data = [
        {
          type: 'noNumericalTableHeader',
          items: contingencyResult.result.columnHeaders
        },
        ...consideredFields.map(function (field) {
          return new Object({
            type: 'dataRow',
            field: field,
            items: contingencyResult.result.row[field]
          })
        }),
        new Object({
          type: 'dataRow',
          field: 'Total',
          items: contingencyResult.result.Total
        })
      ];
    } else {
      var data = [
        {
          type: 'numericalTableHeader',
          items: contingencyResult.result.columnHeaders
        },
        new Object({
          type: 'quantitativeRow',
          field: independentVariableNames[1],
          items: [...consideredFields.map(function (field) {
            return new Object({
              type: 'dataRow',
              field: field,
              items: contingencyResult.result.row[field]
            })
          }),
          new Object({
            type: 'dataRow',
            field: 'Total',
            items: contingencyResult.result.Total
          })
          ]
        })
      ]
    }



    if (numericalIndependentVariables.length == 2){
      data.splice(0,0, new Object({type: 'numericalHeader', field: independentVariableNames[0], items: contingencyResult.result.columnHeaders}))
    }

    var options = {
      backgroundColor: 'transparent',
      headerColor: 'white',
      headerHeight: 0,
      height: 300,
      width: 600,
      legend: { position: 'none' },
      orientation: 'vertical',
    };



    return (
      <div className={ styles.regressionCard }>
          <HeaderBar header={ <span>Contingency Table of <strong className={ styles.dependentVariableTitle }>{ independentVariableNames }</strong></span> } />
              <div className={ styles.grid }>
                <DataGrid data={ data } customRowComponent={ ContingencyTableRow }/>
              </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, comparisonSelector, datasetSelector, fieldProperties } = state;
  const { contingencyResult } = comparisonSelector;


  const categoricalDependentVariable = null;
  const numericalDependentVariable = null;


  const dependentVariable = fieldProperties.items.find((property) => property.id == comparisonSelector.dependentVariableId);
  const dependentVariableName = dependentVariable ? dependentVariable.name : null;
  const dependentVariableField = dependentVariable ? dependentVariable.generalType : null;


  if (dependentVariableField == 'c'){
    const categoricalDependentVariable = dependentVariableName;
  } else if (dependentVariableField == 'q'){
    const numericalDependentVariable = [dependentVariableName, 'MEAN'];
  }

  const independentVariables = fieldProperties.items
    .filter((property) => comparisonSelector.independentVariableIds.indexOf(property.id) >= 0);

  const independentVariableNames = independentVariables
    .map((field) => field.name);

  const numericalIndependentVariableNames = independentVariables
    .filter((property) => property.generalType == "q")
    .map((field) => field.name);

  const numericalIndependentVariables =  numericalIndependentVariableNames
    .map((field) => [field, 4])

  const categoricalIndependentVariableNames = independentVariables
    .filter((property) => property.generalType == "c")
    .map((field) => field.name);

  return {
    projectId: project.properties.id,
    dependentVariableName: dependentVariableName,
    independentVariableNames: independentVariableNames,
    datasetId: datasetSelector.datasetId,
    contingencyResult: contingencyResult,
    numericalDependentVariable: numericalDependentVariable,
    categoricalDependentVariable: categoricalDependentVariable,
    numericalIndependentVariables: numericalIndependentVariables,
    categoricalIndependentVariableNames: categoricalIndependentVariableNames
  };
}

export default connect(mapStateToProps, { runCreateContingency})(ContingencyView);
