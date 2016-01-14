import {
  SELECT_COMPARISON_AGGREGATION_VARIABLE,
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,
  REQUEST_MAKE_COMPARISON,
  RECEIVE_MAKE_COMPARISON
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
      numericalDependentVariable: aggregationVariable,
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
