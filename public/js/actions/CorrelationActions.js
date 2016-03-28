import {
  SELECT_CORRELATION_VARIABLE,
  REQUEST_CORRELATION,
  RECEIVE_CORRELATION,
  PROGRESS_CORRELATION,
  ERROR_CORRELATION,
  REQUEST_CORRELATION_SCATTERPLOT,
  RECEIVE_CORRELATION_SCATTERPLOT
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';

export function selectCorrelationVariable(selectedCorrelationVariable) {
  return {
    type: SELECT_CORRELATION_VARIABLE,
    correlationVariableId: selectedCorrelationVariable,
    selectedAt: Date.now()
  }
}

function requestCorrelationDispactcher(datasetId) {
  return {
    type: REQUEST_CORRELATION
  };
}

function progressCorrelationDispatcher(data) {
  return {
    type: PROGRESS_CORRELATION,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function receiveCorrelationDispatcher(params, json) {
  return {
    type: RECEIVE_CORRELATION,
    data: json,
    receivedAt: Date.now()
  };
}

function errorCorrelationDispatcher(json) {
  return {
    type: ERROR_CORRELATION,
    progress: 'Error running correlations, please check console.'
  };
}

export function getCorrelations(projectId, datasetId, correlationVariables) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      correlationVariables: correlationVariables
    }
  }

  return (dispatch) => {
    dispatch(requestCorrelationDispactcher());
    return fetch('/statistics/v1/correlations', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
    .then(function(json) {
      if (json.compute) {
        dispatch(pollForTask(json.taskId, REQUEST_CORRELATION, params, receiveCorrelationDispatcher, progressCorrelationDispatcher, errorCorrelationDispatcher));
      } else {
        dispatch(receiveCorrelationDispatcher(params, json));
      }
    })
    .catch(err => console.error("Error creating correlation matrix: ", err));
  };
}

function requestCorrelationScatterplotDispatcher() {
  return {
    type: REQUEST_CORRELATION_SCATTERPLOT
  };
}

function receiveCorrelationScatterplotDispatcher(json) {
  return {
    type: RECEIVE_CORRELATION_SCATTERPLOT,
    data: json,
    receivedAt: Date.now()
  };
}

export function getCorrelationScatterplot(projectId, correlationId) {
  return (dispatch) => {
    dispatch(requestCorrelationScatterplotDispatcher());
    return fetch(`/statistics/v1/correlation_scatterplot/${correlationId}?projectId=${projectId}`)
      .then(response => response.json())
      .then(json => dispatch(receiveCorrelationScatterplotDispatcher(json)));
  };
}
