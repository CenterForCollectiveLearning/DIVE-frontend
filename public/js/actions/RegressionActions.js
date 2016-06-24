import {
  SELECT_REGRESSION_INDEPENDENT_VARIABLE,
  SELECT_REGRESSION_DEPENDENT_VARIABLE,
  REQUEST_RUN_REGRESSION,
  RECEIVE_RUN_REGRESSION,
  PROGRESS_RUN_REGRESSION,
  ERROR_RUN_REGRESSION,
  REQUEST_CONTRIBUTION_TO_R_SQUARED,
  RECEIVE_CONTRIBUTION_TO_R_SQUARED,
  REQUEST_CREATE_SAVED_REGRESSION,
  RECEIVE_CREATED_SAVED_REGRESSION,
  REQUEST_CREATE_EXPORTED_REGRESSION,
  RECEIVE_CREATED_EXPORTED_REGRESSION
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';

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

function receiveRunRegressionDispatcher(params, json) {
  return {
    type: RECEIVE_RUN_REGRESSION,
    data: json,
    receivedAt: Date.now()
  };
}

function progressRunRegressionDispatcher(data) {
  return {
    type: PROGRESS_RUN_REGRESSION,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorRunRegressionDispatcher(data) {
  return {
    type: PROGRESS_RUN_REGRESSION,
    progress: 'Error running regressions, please check console.'
  };
}

function requestContributionToRSquaredDispatcher() {
  return {
    type: REQUEST_CONTRIBUTION_TO_R_SQUARED
  };
}

function receiveContributionToRSquaredDispatcher(json) {
  return {
    type: RECEIVE_CONTRIBUTION_TO_R_SQUARED,
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
    }).then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_RUN_REGRESSION, params, receiveRunRegressionDispatcher, progressRunRegressionDispatcher, errorRunRegressionDispatcher));
        } else {
          dispatch(receiveRunRegressionDispatcher(params, json));
        }
      })
  };
}


export function getContributionToRSquared(projectId, regressionId) {
  return (dispatch) => {
    dispatch(requestContributionToRSquaredDispatcher());
    return fetch(`/statistics/v1/contribution_to_r_squared/${regressionId}?projectId=${projectId}`)
      .then(json => dispatch(receiveContributionToRSquaredDispatcher(json)));
  };
}

function requestCreateExportedRegressionDispatcher(action) {
  return {
    type: action
  };
}

function receiveCreatedExportedRegressionDispatcher(action, json) {
  return {
    type: action,
    exportedRegressionId: json.id,
    exportedSpec: json,
    receivedAt: Date.now()
  };
}

export function createExportedRegression(projectId, regressionId, data, saveAction = false) {
  console.log('in createExportedRegression', projectId, regressionId, data);
  const requestAction = saveAction ? REQUEST_CREATE_SAVED_REGRESSION : REQUEST_CREATE_EXPORTED_REGRESSION;
  const receiveAction = saveAction ? RECEIVE_CREATED_SAVED_REGRESSION : RECEIVE_CREATED_EXPORTED_REGRESSION;

  const params = {
    project_id: projectId,
    regression_id: regressionId,
    data: data,
  }

  return dispatch => {
    console.log('dispatching');
    dispatch(requestCreateExportedRegressionDispatcher(requestAction));
    return fetch('/exported_regression/v1/exported_regression', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveCreatedExportedRegressionDispatcher(receiveAction, json)))
      .catch(err => console.error("Error creating exported regressions: ", err));
  };
}
