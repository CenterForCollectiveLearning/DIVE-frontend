import _ from 'underscore';
import { push } from 'react-router-redux';
import { replace } from 'react-router-redux';

import { parseFromQueryObject, updateQueryString } from '../helpers/helpers';

import {
  SELECT_REGRESSION_TYPE,
  SELECT_REGRESSION_INDEPENDENT_VARIABLE,
  SELECT_REGRESSION_DEPENDENT_VARIABLE,
  SELECT_REGRESSION_INTERACTION_TERM,
  REQUEST_RUN_REGRESSION,
  RECEIVE_RUN_REGRESSION,
  PROGRESS_RUN_REGRESSION,
  ERROR_RUN_REGRESSION,
  RECEIVE_CREATED_INTERACTION_TERM,
  DELETED_INTERACTION_TERM,
  REQUEST_INITIAL_REGRESSION_STATE,
  RECEIVE_INITIAL_REGRESSION_STATE,
  REQUEST_CONTRIBUTION_TO_R_SQUARED,
  RECEIVE_CONTRIBUTION_TO_R_SQUARED,
  REQUEST_CREATE_SAVED_REGRESSION,
  RECEIVE_CREATED_SAVED_REGRESSION,
  REQUEST_CREATE_EXPORTED_REGRESSION,
  RECEIVE_CREATED_EXPORTED_REGRESSION,
  SELECT_CONDITIONAL,
  SET_REGRESSION_QUERY_STRING
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';
import { getFilteredConditionals } from './ActionHelpers.js'

function requestInitialRegressionStateDispatcher() {
  return {
    type: REQUEST_INITIAL_REGRESSION_STATE
  };
}

function receiveInitialRegressionStateDispatcher() {
  return {
    type: RECEIVE_INITIAL_REGRESSION_STATE,
    receivedAt: Date.now()
  };
}

export function getRecommendation(projectId, datasetId, callback, dependentVariableId=null, recommendationType='forwardR2') {
  const params = {
    projectId: projectId,
    datasetId: datasetId,
    dependentVariableId: dependentVariableId,
    recommendationType: recommendationType
  }

  return (dispatch) => {
    dispatch(requestInitialRegressionStateDispatcher());
    return fetch('/statistics/v1/initial_regression_state', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => {
      dispatch(receiveInitialRegressionStateDispatcher());
      callback(json);      
    })
  };
}



export function getInitialStateOld(projectId, datasetId, fieldProperties) {
  var categoricalItemIds = fieldProperties.filter((item) => ((item.generalType == 'c') && (!item.isId))).map((item) => item.id);
  var quantitativeItemIds = fieldProperties.filter((item) => ((item.generalType == 'q') && (!item.isId))).map((item) => item.id);
  var n_c = categoricalItemIds.length;
  var n_q = quantitativeItemIds.length;

  var dependentVariableId = _.sample(quantitativeItemIds, 1) || _.sample(categoricalItemIds, 1);
  var independentVariablesIds = [ ..._.sample(quantitativeItemIds.filter((id) => id != dependentVariableId), 3) ];
  var regressionType = 'linear';

  return {
    regressionType: regressionType,
    dependentVariableId: dependentVariableId,
    independentVariablesIds: independentVariablesIds
  }
}

export function setPersistedQueryString(queryString) {
  return {
    type: SET_REGRESSION_QUERY_STRING,
    queryString: queryString
  }
}

export function selectConditional(conditional) {
  return {
    type: SELECT_CONDITIONAL,
    conditional: conditional
  }
}

export function selectRegressionType(selectedRegressionType) {
  return {
    type: SELECT_REGRESSION_TYPE,
    regressionType: selectedRegressionType,
    selectedAt: Date.now()
  }
}

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

export function selectInteractionTerm(interactionTermId) {
  return {
    type: SELECT_REGRESSION_INTERACTION_TERM,
    interactionTermId: interactionTermId
  }
}

export function createInteractionTerm(projectId, datasetId, interactionTermIds) {
  const params = {
    projectId,
    datasetId,
    interactionTermIds
  }
  return dispatch => {
    return fetch('/statistics/v1/interaction_term', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveInteractionTerm(json)))
      .catch(err => console.error("Error creating interaction term:", err));
  }
}

export function deleteInteractionTerm(interaction_term_id) {
  return dispatch => {
    return fetch(`/statistics/v1/interaction_term?id=${ interaction_term_id }`, {
      method: 'delete'
    }).then(json => dispatch(receiveDeletedInteractionTerm(json)))
      .catch(err => console.error("Error deleting interaction term:", err));
  }
}

function receiveInteractionTerm(json) {
  return {
    type: RECEIVE_CREATED_INTERACTION_TERM,
    data: json,
    receivedAt: Date.now()
  }
}

function receiveDeletedInteractionTerm(json) {
  return {
    type: DELETED_INTERACTION_TERM,
    data: json,
    receivedAt: Date.now()
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

export function runRegression(projectId, datasetId, regressionType, dependentVariableName, independentVariableNames, interactionTermIds, conditionals=[], tableLayout='leaveOneOut') {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      regressionType: regressionType,
      dependentVariable: dependentVariableName,
      independentVariables: independentVariableNames,
      interactionTerms: interactionTermIds,
      tableLayout: tableLayout
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
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

export function getContributionToRSquared(projectId, regressionId, conditionals=[]) {
  const params = {
    projectId: projectId,
    regressionId: regressionId
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  return (dispatch) => {
    dispatch(requestContributionToRSquaredDispatcher());
    return fetch('/statistics/v1/contribution_to_r_squared', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveContributionToRSquaredDispatcher(json)))
      .catch(err => console.error("Error getting contribution to R-squared: ", err));
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

export function createExportedRegression(projectId, regressionId, data, conditionals=[], config={}, saveAction = false) {
  const requestAction = saveAction ? REQUEST_CREATE_SAVED_REGRESSION : REQUEST_CREATE_EXPORTED_REGRESSION;
  const receiveAction = saveAction ? RECEIVE_CREATED_SAVED_REGRESSION : RECEIVE_CREATED_EXPORTED_REGRESSION;

  const filteredConditionals = getFilteredConditionals(conditionals);

  const params = {
    project_id: projectId,
    regression_id: regressionId,
    data: data,
    conditionals: filteredConditionals ? filteredConditionals : {},
    config: config
  }

  return dispatch => {
    dispatch(requestCreateExportedRegressionDispatcher(requestAction));
    return fetch('/exported_regression/v1/exported_regression', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveCreatedExportedRegressionDispatcher(receiveAction, json)))
      .catch(err => console.error("Error creating exported regressions: ", err));
  };
}
