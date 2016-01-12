import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runNumericalComparison } from '../../../actions/ComparisonActions';

import styles from '../Analysis.sass';

import DataGrid from '../../Base/DataGrid';
import HeaderBar from '../../Base/HeaderBar';
import NumericalComparisonRow from './NumericalComparisonRow';

import ColumnChart from '../../Visualizations/Charts/ColumnChart';

export class NumericalComparisonView extends Component {

  componentWillReceiveProps(nextProps) {
    const { numericalIndependentVariableNames, runNumericalComparison} = this.props;
    const independentVariablesChanged = nextProps.numericalIndependentVariableNames.length != numericalIndependentVariableNames.length;

    if (nextProps.projectId && nextProps.datasetId && (nextProps.numericalIndependentVariableNames.length >= 2) && independentVariablesChanged) {
      runNumericalComparison(nextProps.projectId, nextProps.datasetId, nextProps.numericalIndependentVariableNames, true);
    }

  }

  render() {
    const { numericalComparisonResult, numericalIndependentVariableNames } = this.props;
    if (!(numericalIndependentVariableNames.length >= 2) || !(numericalComparisonResult.result) ||  numericalComparisonResult.result.length == 0) {
      return (
        <div></div>
      );
    }
    const consideredTests = Object.keys(numericalComparisonResult.result);

    const data = [
      {
        type: 'tableHeader',
        items: ["TEST", "STATISTIC", "P-VALUE"]
      },
      ...consideredTests.map(function (field) {
        return new Object({
          type: 'dataRow',
          field: field,
          items: numericalComparisonResult.result[field]
        })
      })
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

    return (
      <div className={ styles.regressionCard }>
          <HeaderBar header={ <span>Numerical Comparison between <strong className={ styles.dependentVariableTitle }>{ numericalIndependentVariableNames }</strong></span> } />
              <div className={ styles.grid }>
                <DataGrid data={ data } customRowComponent={ NumericalComparisonRow }/>
              </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, comparisonSelector, datasetSelector, fieldProperties } = state;
  const { numericalComparisonResult } = comparisonSelector;


  const numericalIndependentVariableNames = fieldProperties.items
    .filter((property) => comparisonSelector.independentVariableIds.indexOf(property.id) >= 0)
    .filter((property) => property.generalType == "q")
    .map((field) => field.name);

  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    numericalComparisonResult: numericalComparisonResult,
    numericalIndependentVariableNames: numericalIndependentVariableNames,
  };
}

export default connect(mapStateToProps, { runNumericalComparison})(NumericalComparisonView);
