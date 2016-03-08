import {
  SELECT_SUMMARY_AGGREGATION_VARIABLE,
  SELECT_SUMMARY_INDEPENDENT_VARIABLE,
  SELECT_SUMMARY_AGGREGATION_FUNCTION,
  SELECT_SUMMARY_AGGREGATION_WEIGHT_VARIABLE,
  REQUEST_AGGREGATION,
  RECEIVE_AGGREGATION,
  REQUEST_ONE_D_COMPARISON,
  RECEIVE_ONE_D_COMPARISON,
  REQUEST_SUMMARY_STATISTICS,
  RECEIVE_SUMMARY_STATISTICS,
  SELECT_SUMMARY_CONFIG_X,
  SELECT_SUMMARY_CONFIG_Y
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

export function selectBinningConfigX(config) {
  return {
    type: SELECT_SUMMARY_CONFIG_X,
    config: config
  }
}

export function selectBinningConfigY(config) {
  return {
    type: SELECT_SUMMARY_CONFIG_Y,
    config: config
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
      comparisonVariables: comparisonVariables
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
      comparisonVariable: comparisonVariables[0]
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

function requestSummaryStatisticsDispatcher(datasetId) {
  return {
    type: REQUEST_SUMMARY_STATISTICS
  };
}

function receiveSummaryStatisticsDispatcher(json) {
  return {
    type: RECEIVE_SUMMARY_STATISTICS,
    data: json,
    receivedAt: Date.now()
  };
}

export function getVariableSummaryStatistics(projectId, datasetId, aggregationVariableIds) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      fieldIds: aggregationVariableIds
    }
  }

  return (dispatch) => {
    dispatch(requestSummaryStatisticsDispatcher());
    return fetch('/statistics/v1/summary_stats', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveSummaryStatisticsDispatcher(json)))
      .catch(err => console.error("Error creating summary table: ", err));
  };
}
