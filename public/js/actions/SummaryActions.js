import {
  SELECT_SUMMARY_AGGREGATION_VARIABLE,
  SELECT_SUMMARY_INDEPENDENT_VARIABLE,
  SELECT_SUMMARY_AGGREGATION_FUNCTION,
  SELECT_SUMMARY_AGGREGATION_WEIGHT_VARIABLE,
  REQUEST_AGGREGATION,
  RECEIVE_AGGREGATION,
  REQUEST_ONE_D_COMPARISON,
  RECEIVE_ONE_D_COMPARISON
} from '../constants/ActionTypes';

import { fetch } from './api.js';

export function selectSummaryIndependentVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_SUMMARY_INDEPENDENT_VARIABLE,
    comparisonIndependentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationVariable(selectedAggregationVariableId) {
  return {
    type: SELECT_SUMMARY_AGGREGATION_VARIABLE,
    comparisonAggregationVariableId: selectedAggregationVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationWeightVariable(selectedWeightVariableId) {
  return {
    type: SELECT_SUMMARY_AGGREGATION_WEIGHT_VARIABLE,
    aggregationWeightVariableId: selectedWeightVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationFunction(selectedAggregationFunction) {
  return {
    type: SELECT_SUMMARY_AGGREGATION_FUNCTION,
    aggregationFunction: selectedAggregationFunction,
    selectedAt: Date.now()
  }
}

function requestAggregationDispatcher(datasetId) {
  return {
    type: REQUEST_AGGREGATION
  };
}

function receiveAggregationDispatcher(json) {
  return {
    type: RECEIVE_AGGREGATION,
    data: json,
    receivedAt: Date.now()
  };
}

export function runAggregation(projectId, datasetId, aggregationVariable, comparisonVariables) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: aggregationVariable,
      categoricalIndependentVariableNames: comparisonVariables
    }
  }

  return (dispatch) => {
    dispatch(requestAggregationDispatcher());
    return fetch('/statistics/v1/contingency_table', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveAggregationDispatcher(json)))
      .catch(err => console.error("Error creating contingency table: ", err));
  };
}

function requestOneDComparisonDispatcher(datasetId) {
  return {
    type: REQUEST_ONE_D_COMPARISON
  };
}

function receiveOneDComparisonDispatcher(json) {
  return {
    type: RECEIVE_ONE_D_COMPARISON,
    data: json,
    receivedAt: Date.now()
  };
}

export function runComparisonOneDimensional(projectId, datasetId, aggregationVariable, comparisonVariables) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: aggregationVariable,
      categoricalIndependentVariableName: comparisonVariables[0]
    }
  }

  return (dispatch) => {
    dispatch(requestOneDComparisonDispatcher());
    return fetch('/statistics/v1/one_dimensional_contingency_table', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveOneDComparisonDispatcher(json)))
      .catch(err => console.error("Error creating contingency table: ", err));
  };
}
