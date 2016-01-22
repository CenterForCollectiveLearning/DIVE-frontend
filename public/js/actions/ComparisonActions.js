import {
  SELECT_COMPARISON_VARIABLE,
  REQUEST_NUMERICAL_COMPARISON,
  RECEIVE_NUMERICAL_COMPARISON
} from '../constants/ActionTypes';

import { fetch } from './api.js';

export function selectComparisonVariable(selectedVariableId) {
  return {
    type: SELECT_COMPARISON_VARIABLE,
    comparisonVariableId: selectedVariableId,
    selectedAt: Date.now()
  }
}

function requestNumericalComparisonDispatcher(datasetId) {
  return {
    type: REQUEST_NUMERICAL_COMPARISON
  };
}

function receiveNumericalComparisonDispatcher(json) {
  return {
    type: RECEIVE_NUMERICAL_COMPARISON,
    data: json,
    receivedAt: Date.now()
  };
}

export function runNumericalComparison(projectId, datasetId, comparisonVariableNames, independence) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      variableNames: comparisonVariableNames,
      independence: independence
    }
  }

  return (dispatch) => {
    dispatch(requestNumericalComparisonDispatcher);
    return fetch('/statistics/v1/numerical_comparison', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveNumericalComparisonDispatcher(json)))
      .catch(err => console.error("Error performing numerical comparison: ", err));
  };
}
