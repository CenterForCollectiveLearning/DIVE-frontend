import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runRegression, getContributionToRSquared } from '../../../actions/RegressionActions';

import styles from '../Analysis.sass';

import DataGrid from '../../Base/DataGrid';
import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import RegressionTableRow from './RegressionTableRow';

import ColumnChart from '../../Visualizations/Charts/ColumnChart';

export class RegressionView extends Component {

  componentWillReceiveProps(nextProps) {
    const { dependentVariableName, independentVariableNames, runRegression, getContributionToRSquared } = this.props;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariableChanged = nextProps.dependentVariableName != dependentVariableName;

    if (nextProps.projectId && nextProps.datasetId && (dependentVariableChanged || independentVariablesChanged)) {
      runRegression(nextProps.projectId, nextProps.datasetId, nextProps.dependentVariableName, nextProps.independentVariableNames);
    }

    if (nextProps.projectId && nextProps.regressionResult.id && (nextProps.regressionResult.id != this.props.regressionResult.id)) {
      getContributionToRSquared(nextProps.projectId, nextProps.regressionResult.id);
    }
  }

  render() {
    const { regressionResult, contributionToRSquared, dependentVariableName, independentVariableNames } = this.props;

    if (!regressionResult.fields || regressionResult.fields.length == 0) {
      return (
        <div className={ styles.regressionViewContainer }></div>
      );
    }

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

    const data = [
      {
        type: 'tableHeader',
        size: regressionResult.numColumns
      },
      ...allRegressedFields.map(function (field) {
        return new Object({
          type: 'dataRow',
          field: field.formattedName,
          items: regressionResult.regressionsByColumn.map(function (column) {
            return { ...field, property: column.regression.propertiesByField.find((property) => property.baseField == field.name) }
          })
        })
      }),
      {
        type: 'footerRow',
        field: 'rSquared',
        formattedField: '<div class="cmu">R<sup>2</sup></div>',
        items: regressionResult.regressionsByColumn.map((column) => column.columnProperties.rSquared)
      },
      {
        type: 'footerRow',
        field: 'rSquaredAdjusted',
        formattedField: '<div class="cmu">R</div><sup class="cmu">2</sup>',
        items: regressionResult.regressionsByColumn.map((column) => column.columnProperties.rSquaredAdj)
      },
      {
        type: 'footerRow',
        field: 'fTest',
        formattedField: '<em class="cmu">F</em>',
        items: regressionResult.regressionsByColumn.map((column) => column.columnProperties.fTest)
      },
      {
        type: 'footerRow',
        field: 'aic',
        formattedField: '<div class="cmu">AIC</div>',
        items: regressionResult.regressionsByColumn.map((column) => column.columnProperties.aic)
      },
      {
        type: 'footerRow',
        field: 'bic',
        formattedField: '<div class="cmu">BIC</div>',
        items: regressionResult.regressionsByColumn.map((column) => column.columnProperties.bic)
      }
    ];

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

    const regressedIndependentVariableNames = independentVariableNames.length == 0 ?
      regressionResult.fields.map((field) => field.name)
      : independentVariableNames;

    const independentVariableNamesString = regressedIndependentVariableNames.length > 1 ?
      regressedIndependentVariableNames
        .map((name) => <strong>{ name }</strong>)
        .reduce((previousValue, currentValue, index, array) =>
          <span><span>{ previousValue }</span><span>{ (index == array.length - 1 ? ', and ' : ', ') }</span><span>{ currentValue }</span></span>
        )
      : <strong>{ regressedIndependentVariableNames }</strong>;

    const sortedRSquaredAdjusted = regressionResult.regressionsByColumn
      .map((column, i) => new Object({ index: `(${ i + 1 })`, value: column.columnProperties.rSquaredAdj }))
      .sort((a, b) => (a.value >= b.value) ? (a.value > b.value ? -1 : 0) : 1)
      .map((obj) => new Object({ ...obj, value: getRoundedString(obj.value)}));

    const rSquaredAdjustedStrings = {
      highest: sortedRSquaredAdjusted[0],
      lowest: sortedRSquaredAdjusted[sortedRSquaredAdjusted.length - 1]
    }

    const sortedContributionToRSquared = contributionToRSquared.slice(1)
      .map((row) => new Object({ name: row[0], value: row[1] }))
      .sort((a, b) => (a.value >= b.value) ? (a.value > b.value ? -1 : 0) : 1)
      .map((obj) => new Object({ ...obj, value: getRoundedString(obj.value)}));

    const contributionToRSquaredStrings = {
      highest: sortedContributionToRSquared[0],
      lowest: sortedContributionToRSquared[sortedContributionToRSquared.length - 1]
    };

    const textParams = {
      dependentVariableName: <strong>{ dependentVariableName }</strong>,
      independentVariableNames: independentVariableNamesString,
      rSquaredAdjustedText: <div className={ styles.rSquaredAdjust }><div className={ styles.r }>R</div><sup>2</sup></div>,
      rSquaredText: <div className={ styles.rSquared }><div className={ styles.r }>R</div><sup>2</sup></div>,
      rSquaredAdjusted: rSquaredAdjustedStrings,
      contributionToRSquared: contributionToRSquaredStrings
    }

    return (
      <div className={ styles.regressionViewContainer }>
        <Card>
          <HeaderBar header={ <span>Cascading Linear Regressions of <strong className={ styles.dependentVariableTitle }>{ dependentVariableName }</strong></span> } />

          <div className={ styles.grid }>
            <DataGrid data={ data } customRowComponent={ RegressionTableRow }/>
          </div>

          <div className={ styles.summary }>
            <div className={ styles.summaryColumn }>
              <div>
                This table displays the results of a linear regression explaining the dependent variable { textParams.dependentVariableName } with combinations of the independent variables { textParams.independentVariableNames }.
              </div>
              <div>
                For each variable, the regression coefficient is the first value, significance is represented by number of asterisks, and standard error by the number in parentheses.
              </div>
            </div>
            <div className={ styles.summaryColumn }>
              { ((textParams.rSquaredAdjusted.lowest.index != textParams.rSquaredAdjusted.highest.index) || (textParams.rSquaredAdjusted.lowest.value != textParams.rSquaredAdjusted.highest.value)) &&
                <div>
                  The { textParams.rSquaredAdjustedText }, the amount of variance explained by the independent variables, varies from <strong>{ textParams.rSquaredAdjusted.highest.value }</strong> in equation <strong>{ textParams.rSquaredAdjusted.highest.index }</strong> to <strong>{ textParams.rSquaredAdjusted.lowest.value }</strong> in equation <strong>{ textParams.rSquaredAdjusted.lowest.index }</strong>.
                </div>
              }
              { ((textParams.rSquaredAdjusted.lowest.index == textParams.rSquaredAdjusted.highest.index) && (textParams.rSquaredAdjusted.lowest.value == textParams.rSquaredAdjusted.highest.value)) &&
                <div>
                  The { textParams.rSquaredAdjustedText }, the amount of variance explained by the independent variables, is <strong>{ textParams.rSquaredAdjusted.highest.value }</strong>.
                </div>
              }
              { textParams.contributionToRSquared.highest &&
                <div>
                  Contribution to { textParams.rSquaredText }, determined by comparing models without a variable to the full model with all variables, is highest for <strong>{ textParams.contributionToRSquared.highest.name }</strong> and lowest for variable <strong>{ textParams.contributionToRSquared.lowest.name }</strong>.
                </div>
              }
            </div>
          </div>
        </Card>
        { (contributionToRSquared.length > 0) &&
          <Card>
            <HeaderBar header={ <span>Contribution to R<sup>2</sup></span> } />

            <div className={ styles.contributionToRSquared }>
              <ColumnChart
                chartId={ `bar-${ regressionResult.id }` }
                data={ contributionToRSquared }
                options={ options } />
            </div>
          </Card>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, regressionSelector, datasetSelector, fieldProperties } = state;
  const { regressionResult, contributionToRSquared } = regressionSelector;

  const dependentVariable = fieldProperties.items.find((property) => property.id == regressionSelector.dependentVariableId);
  const dependentVariableName = dependentVariable ? dependentVariable.name : null;

  const independentVariableNames = fieldProperties.items
    .filter((property) => regressionSelector.independentVariableIds.indexOf(property.id) >= 0)
    .map((independentVariable) => independentVariable.name);

  return {
    projectId: project.properties.id,
    dependentVariableName: dependentVariableName,
    independentVariableNames: independentVariableNames,
    datasetId: datasetSelector.datasetId,
    regressionResult: regressionResult,
    contributionToRSquared: contributionToRSquared
  };
}

export default connect(mapStateToProps, { runRegression, getContributionToRSquared })(RegressionView);
