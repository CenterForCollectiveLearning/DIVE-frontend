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
    const { independentVariableNames, dependentVariableName, numericalDependentVariable, categoricalDependentVariable, numericalIndependentVariableNames, categoricalIndependentVariableNames, runCreateContingency} = this.props;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariableChanged = nextProps.dependentVariableName != dependentVariableName;

    if (nextProps.projectId && nextProps.datasetId && (nextProps.independentVariableNames.length == 2) && (dependentVariableChanged || independentVariablesChanged)) {
      runCreateContingency(nextProps.projectId, nextProps.datasetId, nextProps.numericalDependentVariable, nextProps.categoricalDependentVariable, nextProps.numericalIndependentVariableNames, nextProps.categoricalIndependentVariableNames);
    }

  }

  render() {
    const { contingencyResult, dependentVariableName, independentVariableNames } = this.props;
    console.log('asdf');
    console.log(!(independentVariableNames.length == 2));
    if (!(contingencyResult.result) || !(contingencyResult.result.row) || contingencyResult.result.row.length == 0) {
      return (
        <div className={ styles.regressionViewContainer }></div>
      );
    }

    // const allRegressedFields = regressionResult.fields.map(function (field){
    //   if (!field.values) {
    //     // numeric
    //     return { ...field, formattedName: field.name, enabled: true };
    //
    //   } else if (field.values.length == 1) {
    //     // categorical binary
    //     return { name: field.name, formattedName: `${ field.name }: <span>${ field.values[0] }</span>`, enabled: true };
    //
    //   } else {
    //     // categorical fixed effects
    //     return { ...field, formattedName: field.name, enabled: false };
    //
    //   }
    // });

    const consideredFields = contingencyResult.result.rowHeaders;
    console.log('bitch');
    console.log('bitch');
    console.log('bitch');
    console.log('bitch');
    console.log(contingencyResult);
    console.log(contingencyResult.result);
    console.log(consideredFields);
    console.log(contingencyResult.result.row);




    const data = [
      {
        type: 'tableHeader',
        items: contingencyResult.result.columnHeaders
      },
      ...consideredFields.map(function (field) {
        return new Object({
          type: 'dataRow',
          field: field,
          items: contingencyResult.result.row[field]
        })
      })
    ];

    console.log('YYYYYY');
    console.log(data[1].items);
    console.log(data[2].items);
    //   }),
    //   {
    //     type: 'footerRow',
    //     field: 'bic',
    //     formattedField: '<div class="cmu">BIC</div>',
    //     items: regressionResult.regressionsByColumn.map((column) => column.columnProperties.bic)
    //   }
    // ];

    var options = {
      backgroundColor: 'transparent',
      headerColor: 'white',
      headerHeight: 0,
      height: 300,
      width: 600,
      legend: { position: 'none' },
      orientation: 'vertical',
    };

    const getRoundedString = function (num, decimalPlaces=3) {
      if (num) {
        return num >=1 ?
          +parseFloat(num).toFixed(decimalPlaces) :
          +parseFloat(num).toPrecision(decimalPlaces);
      }

      return '';
    };

    // const regressedIndependentVariableNames = independentVariableNames.length == 0 ?
    //   regressionResult.fields.map((field) => field.name)
    //   : independentVariableNames;
    //
    // const independentVariableNamesString = regressedIndependentVariableNames.length > 1 ?
    //   regressedIndependentVariableNames
    //     .map((name) => <strong>{ name }</strong>)
    //     .reduce((previousValue, currentValue, index, array) =>
    //       <span><span>{ previousValue }</span><span>{ (index == array.length - 1 ? ', and ' : ', ') }</span><span>{ currentValue }</span></span>
    //     )
    //   : <strong>{ regressedIndependentVariableNames }</strong>;

    // const sortedRSquaredAdjusted = regressionResult.regressionsByColumn
    //   .map((column, i) => new Object({ index: `(${ i + 1 })`, value: column.columnProperties.rSquaredAdj }))
    //   .sort((a, b) => (a.value >= b.value) ? (a.value > b.value ? -1 : 0) : 1)
    //   .map((obj) => new Object({ ...obj, value: getRoundedString(obj.value)}));
    //
    // const rSquaredAdjustedStrings = {
    //   highest: sortedRSquaredAdjusted[0],
    //   lowest: sortedRSquaredAdjusted[sortedRSquaredAdjusted.length - 1]
    // }
    //
    // const sortedContributionToRSquared = contributionToRSquared.slice(1)
    //   .map((row) => new Object({ name: row[0], value: row[1] }))
    //   .sort((a, b) => (a.value >= b.value) ? (a.value > b.value ? -1 : 0) : 1)
    //   .map((obj) => new Object({ ...obj, value: getRoundedString(obj.value)}));
    //
    // const contributionToRSquaredStrings = {
    //   highest: sortedContributionToRSquared[0],
    //   lowest: sortedContributionToRSquared[sortedContributionToRSquared.length - 1]
    // };

    // const textParams = {
    //   dependentVariableName: <strong>{ dependentVariableName }</strong>,
    //   independentVariableNames: independentVariableNamesString,
    //   // rSquaredAdjustedText: <div className={ styles.rSquaredAdjust }><div className={ styles.r }>R</div><sup>2</sup></div>,
    //   // rSquaredText: <div className={ styles.rSquared }><div className={ styles.r }>R</div><sup>2</sup></div>,
    //   // rSquaredAdjusted: rSquaredAdjustedStrings,
    //   // contributionToRSquared: contributionToRSquaredStrings
    // }
    console.log('data is actually correct u fool');
    return (
      <div className={ styles.comparisonViewContainer }>
        <div className={ styles.regressionCard }>
            <HeaderBar header={ <span>Contingency Table of <strong className={ styles.dependentVariableTitle }>{ independentVariableNames }</strong></span> } />
                <div className={ styles.grid }>
                  <DataGrid data={ data } customRowComponent={ ContingencyTableRow }/>
                </div>
          hmmmm
        </div>

      </div>
      // <div className={ styles.regressionViewContainer }>
      //   <div className={ styles.regressionCard }>
      //     <HeaderBar header={ <span>Cascading Linear Regressions of <strong className={ styles.dependentVariableTitle }>{ dependentVariableName }</strong></span> } />
      //
      //     <div className={ styles.grid }>
      //       <DataGrid data={ data } customRowComponent={ ContingencyTableRow }/>
      //     </div>
      //   </div>
      // </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, comparisonSelector, datasetSelector, fieldProperties } = state;
  const { contingencyResult } = comparisonSelector;

  // const numericalIndependentVariableNames = []
  // const categoricalIndependentVariableNames = []
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

  console.log('hopefully this clear things up');
  console.log(numericalIndependentVariableNames);
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
    numericalIndependentVariableNames: numericalIndependentVariableNames,
    categoricalIndependentVariableNames: categoricalIndependentVariableNames
  };
}

export default connect(mapStateToProps, { runCreateContingency})(ContingencyView);
