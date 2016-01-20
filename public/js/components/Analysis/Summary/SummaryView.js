import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runAggregation } from '../../../actions/SummaryActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import AggregationTable from './AggregationTable';

export class SummaryView extends Component {
  componentWillReceiveProps(nextProps) {
    const { aggregationIndependentVariableNames, aggregationVariableName, aggregationFunction, weightVariableName, runAggregation } = this.props;
    const aggregationIndependentVariablesChanged = nextProps.aggregationIndependentVariableNames.length != aggregationIndependentVariableNames.length;
    const aggregationVariableChanged = nextProps.aggregationVariableName != aggregationVariableName;
    const aggregationFunctionChanged = nextProps.aggregationFunction != aggregationFunction;
    const weightVariableChanged = nextProps.weightVariableName != weightVariableName;

    if (nextProps.projectId && nextProps.datasetId && (aggregationVariableChanged || aggregationIndependentVariablesChanged || aggregationFunctionChanged || weightVariableChanged) && (nextProps.aggregationIndependentVariableNames.length == 2)) {
      const aggregationList = nextProps.aggregationVariableName? [nextProps.aggregationVariableName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null
      runAggregation(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.aggregationIndependentVariableNames);
    }

  }
  render() {
    const { aggregationResult, aggregationIndependentVariableNames} = this.props;

    if (!(aggregationIndependentVariableNames.length == 2) || !aggregationResult || !(aggregationResult.rows) || aggregationResult.rows.length == 0) {
      return (
        <div></div>
      );
    }

    return (
      <div className={ styles.summaryViewContainer }>
        <Card>
          <HeaderBar header={ <span>Aggregation Table</span> } />
          <AggregationTable aggregationResult={ aggregationResult } aggregationIndependentVariableNames={ aggregationIndependentVariableNames }/>
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, summarySelector, datasetSelector, fieldProperties } = state;
  const { aggregationResult } = summarySelector;

  const aggregationVariable = fieldProperties.items.find((property) => property.id == summarySelector.aggregationVariableId);
  const aggregationVariableName = aggregationVariable ? aggregationVariable.name : null;

  const aggregationIndependentVariableNames = fieldProperties.items
    .filter((property) => summarySelector.comparisonVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  const weightVariable = fieldProperties.items.find((property) => property.id == summarySelector.weightVariableId);
  const weightVariableName = weightVariable ? weightVariable.name : 'UNIFORM';

  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    aggregationResult: aggregationResult,
    aggregationVariableName: aggregationVariableName,
    aggregationFunction: summarySelector.aggregationFunction,
    weightVariableName: weightVariableName,
    aggregationIndependentVariableNames: aggregationIndependentVariableNames
  };
}

export default connect(mapStateToProps, { runAggregation })(SummaryView);
