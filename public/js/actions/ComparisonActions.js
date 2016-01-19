import {
  SELECT_COMPARISON_AGGREGATION_VARIABLE,
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,
  SELECT_COMPARISON_AGGREGATION_FUNCTION,
  SELECT_COMPARISON_WEIGHT_VARIABLE,
  REQUEST_MAKE_COMPARISON,
  RECEIVE_MAKE_COMPARISON,
  REQUEST_MAKE_ONE_D_COMPARISON,
  RECEIVE_MAKE_ONE_D_COMPARISON
} from '../constants/ActionTypes';

import { fetch } from './api.js';

export function selectComparisonVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_COMPARISON_INDEPENDENT_VARIABLE,
    comparisonIndependentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationVariable(selectedAggregationVariableId) {
  return {
    type: SELECT_COMPARISON_AGGREGATION_VARIABLE,
    comparisonAggregationVariableId: selectedAggregationVariableId,
    selectedAt: Date.now()
  }
}

export function selectComparisonWeightVariable(selectedWeightVariableId) {
  return {
    type: SELECT_COMPARISON_WEIGHT_VARIABLE,
    comparisonWeightVariableId: selectedWeightVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationFunction(selectedAggregationFunction) {
  return {
    type: SELECT_COMPARISON_AGGREGATION_FUNCTION,
    comparisonAggregationFunction: selectedAggregationFunction,
    selectedAt: Date.now()
  }
}

function requestMakeComparisonDispatcher(datasetId) {
  return {
    type: REQUEST_MAKE_COMPARISON
  };
}

function receiveMakeComparisonDispatcher(json) {
  return {
    type: RECEIVE_MAKE_COMPARISON,
    data: json,
    receivedAt: Date.now()
  };
}

export function runMakeComparison(projectId, datasetId, aggregationVariable, comparisonVariables) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: aggregationVariable,
      categoricalIndependentVariableNames: comparisonVariables
    }
  }

  return (dispatch) => {
    dispatch(requestMakeComparisonDispatcher());
    return fetch('/statistics/v1/contingency_table', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveMakeComparisonDispatcher(json)))
      .catch(err => console.error("Error creating contingency table: ", err));
  };
}

function requestMakeOneDComparisonDispatcher(datasetId) {
  return {
    type: REQUEST_MAKE_ONE_D_COMPARISON
  };
}

function receiveMakeOneDComparisonDispatcher(json) {
  return {
    type: RECEIVE_MAKE_ONE_D_COMPARISON,
    data: json,
    receivedAt: Date.now()
  };
}

export function runMakeComparisonOneDimensional(projectId, datasetId, aggregationVariable, comparisonVariables) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: aggregationVariable,
      categoricalIndependentVariableName: comparisonVariables[0]
    }
  }

  return (dispatch) => {
    dispatch(requestMakeOneDComparisonDispatcher());
    return fetch('/statistics/v1/one_dimensional_contingency_table', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveMakeOneDComparisonDispatcher(json)))
      .catch(err => console.error("Error creating contingency table: ", err));
  };
}
