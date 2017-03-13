import _ from 'underscore'

import {
  CORRELATION_MODE,
  SELECT_CORRELATION_VARIABLE,
  REQUEST_CORRELATION,
  RECEIVE_CORRELATION,
  PROGRESS_CORRELATION,
  ERROR_CORRELATION,
  REQUEST_CORRELATION_SCATTERPLOT,
  RECEIVE_CORRELATION_SCATTERPLOT,
  REQUEST_CREATE_SAVED_CORRELATION,
  RECEIVE_CREATED_SAVED_CORRELATION,
  REQUEST_CREATE_EXPORTED_CORRELATION,
  RECEIVE_CREATED_EXPORTED_CORRELATION,
  SELECT_CONDITIONAL,
  SET_CORRELATION_QUERY_STRING
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';
import { getFilteredConditionals } from './ActionHelpers.js'

export function getInitialState(projectId, datasetId, fieldProperties) {
  var quantitativeItemIds = fieldProperties.filter((item) => (item.generalType == 'q' && !item.isId)).map((item) => item.id)
  var n_q = quantitativeItemIds.length;
  var selectedVariablesIds = [];

  var max_samples = 3
  var num_samples = Math.min(n_q, max_samples);
  selectedVariablesIds = _.sample(quantitativeItemIds, 3);

  return {
    correlationVariablesIds: selectedVariablesIds
  }
}

export function setPersistedQueryString(queryString) {
  return {
    type: SET_CORRELATION_QUERY_STRING,
    queryString: queryString
  }
}

export function selectConditional(conditional) {
  return {
    type: SELECT_CONDITIONAL,
    conditional: conditional
  }
}

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

export function getCorrelations(projectId, datasetId, correlationVariables, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      correlationVariables: correlationVariables
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  const dispatchers = {
    success: receiveCorrelationDispatcher,
    progress: progressCorrelationDispatcher,
    error: errorCorrelationDispatcher
  }

  return (dispatch) => {
    dispatch(requestCorrelationDispactcher());
    return fetch('/statistics/v1/correlations', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(function(json) {
      if (json.compute) {
        dispatch(pollForTask(json.taskId, CORRELATION_MODE, REQUEST_CORRELATION, params, dispatchers));
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

export function getCorrelationScatterplot(projectId, correlationId, conditionals=[]) {

  const params = {
    projectId: projectId,
    correlationId: correlationId
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  return (dispatch) => {
    dispatch(requestCorrelationScatterplotDispatcher);
    return fetch('/statistics/v1/correlation_scatterplot', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveCorrelationScatterplotDispatcher(json)))
      .catch(err => console.error("Error getting correlation scatterplot: ", err));
  };
}

function requestCreateExportedCorrelationDispatcher(action) {
  return {
    type: action
  };
}

function receiveCreatedExportedCorrelationDispatcher(action, json) {
  return {
    type: action,
    exportedCorrelationId: json.id,
    exportedSpec: json,
    receivedAt: Date.now()
  };
}

export function createExportedCorrelation(projectId, correlationId, data, conditionals=[], config={}, saveAction = false) {
  const requestAction = saveAction ? REQUEST_CREATE_SAVED_CORRELATION : REQUEST_CREATE_EXPORTED_CORRELATION;
  const receiveAction = saveAction ? RECEIVE_CREATED_SAVED_CORRELATION : RECEIVE_CREATED_EXPORTED_CORRELATION;

  const filteredConditionals = getFilteredConditionals(conditionals);

  const params = {
    project_id: projectId,
    correlation_id: correlationId,
    data: data,
    conditionals: filteredConditionals ? filteredConditionals : {},
    config: config
  }

  return dispatch => {
    dispatch(requestCreateExportedCorrelationDispatcher(requestAction));
    return fetch('/exported_correlation/v1/exported_correlation', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveCreatedExportedCorrelationDispatcher(receiveAction, json)))
      .catch(err => console.error("Error creating exported correlation: ", err));
  };
}
