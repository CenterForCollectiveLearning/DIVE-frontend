import {
  SELECT_SUMMARY_AGGREGATION_VARIABLE,
  SELECT_SUMMARY_INDEPENDENT_VARIABLE,
  SELECT_SUMMARY_AGGREGATION_FUNCTION,
  SELECT_SUMMARY_AGGREGATION_WEIGHT_VARIABLE,
  REQUEST_AGGREGATION,
  RECEIVE_AGGREGATION
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
      numericalDependentVariable: aggregationVariable,
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
