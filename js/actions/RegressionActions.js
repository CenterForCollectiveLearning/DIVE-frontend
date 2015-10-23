import {
  SELECT_REGRESSION_INDEPENDENT_VARIABLE,
  SELECT_REGRESSION_DEPENDENT_VARIABLE,
  REQUEST_RUN_REGRESSION,
  RECEIVE_RUN_REGRESSION
} from '../constants/ActionTypes';

import { fetch, pollForTaskResult } from './api.js';

export function selectIndependentVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_REGRESSION_INDEPENDENT_VARIABLE,
    independentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}

export function selectDependentVariable(selectedDependentVariableId) {
  return {
    type: SELECT_REGRESSION_DEPENDENT_VARIABLE,
    dependentVariableId: selectedDependentVariableId,
    selectedAt: Date.now()
  }
}

function requestRunRegressionDispatcher(datasetId) {
  return {
    type: REQUEST_RUN_REGRESSION
  };
}

function receiveRunRegressionDispatcher(json) {
  return {
    type: RECEIVE_RUN_REGRESSION,
    data: json,
    receivedAt: Date.now()
  };
}

export function runRegression(projectId, datasetId, dependentVariableName, independentVariableNames) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: dependentVariableName,
      independentVariables: independentVariableNames
    }
  }

  return (dispatch) => {
    dispatch(requestRunRegressionDispatcher());
    return fetch('/statistics/v1/regression', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }      
    }).then(response => response.json())
      .then(json => dispatch(receiveRunRegressionDispatcher(json)))
      .catch(err => console.error("Error running regression: ", err));
  };
 
}
