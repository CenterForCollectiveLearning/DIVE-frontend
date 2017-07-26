import _ from 'underscore';

import {
  COMPARISON_MODE,
  UPDATE_COMPARISON_INPUT,
  REQUEST_COMPARISON,
  PROGRESS_COMPARISON,
  RECEIVE_COMPARISON,
  ERROR_COMPARISON,
  REQUEST_CREATE_SAVED_COMPARISON,
  RECEIVE_CREATED_SAVED_COMPARISON,
  REQUEST_CREATE_EXPORTED_COMPARISON,
  RECEIVE_CREATED_EXPORTED_COMPARISON,    
  SELECT_CONDITIONAL,
  SET_COMPARISON_QUERY_STRING
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';
import { getFilteredConditionals } from './ActionHelpers.js'

export function getInitialState(projectId, datasetId, fieldProperties) {
  var categoricalItemIds = fieldProperties.filter((item) => ((item.scale == 'nominal' || item.scale == 'ordinal') && (!item.isId) && (item.stats.unique > 1))).map((item) => item.id);
  var quantitativeItemIds = fieldProperties.filter((item) => ((item.generalType == 'q') && (!item.isId))).map((item) => item.id);
  var n_c = categoricalItemIds.length;
  var n_q = quantitativeItemIds.length;

  var independentVariablesIds = [];
  var dependentVariablesIds = [];
  if (n_c >= 1 && n_q >= 1) {
    independentVariablesIds = _.sample(categoricalItemIds, 1);
    dependentVariablesIds = _.sample(quantitativeItemIds, 1);
  }
  if (n_c == 0 && n_q >= 2) {
    independentVariablesIds = _.sample(quantitativeItemIds, 2);
  }

  return {
    dependentVariablesIds: dependentVariablesIds,
    independentVariablesIds: independentVariablesIds,
  };
}

export function setPersistedQueryString(queryString) {
  return {
    type: SET_COMPARISON_QUERY_STRING,
    queryString: queryString
  }
}

export function selectConditional(conditional) {
  return {
    type: SELECT_CONDITIONAL,
    conditional: conditional
  }
}

export function updateComparisonInput(listTestInput) {
  return {
    type: UPDATE_COMPARISON_INPUT,
    test: listTestInput[0],
    userInput: listTestInput[1],
    selectedAt: Date.now()
  }
}


function requestComparisonDispatcher(datasetId) {
  return {
    type: REQUEST_COMPARISON
  };
}

function progressComparisonDispatcher(data) {
  return {
    type: PROGRESS_COMPARISON,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function receiveComparisonDispatcher(params, json) {
  return {
    type: RECEIVE_COMPARISON,
    data: json,
    receivedAt: Date.now()
  };
}

function errorComparisonDispatcher(data) {
  return {
    type: ERROR_COMPARISON,
    message: data.error
  };
}

export function runComparison(projectId, datasetId, dependentVariableNames, independentVariableNames, significance=0.05, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      independentVariablesNames: independentVariableNames,
      dependentVariablesNames: dependentVariableNames
    }
  }
  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  const dispatchers = {
    success: receiveComparisonDispatcher,
    progress: progressComparisonDispatcher,
    error: errorComparisonDispatcher
  }

  return (dispatch) => {
    dispatch(requestComparisonDispatcher());
    return fetch('/statistics/v1/comparison', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, COMPARISON_MODE, REQUEST_COMPARISON, params, dispatchers));
        } else {
          dispatch(receiveComparisonDispatcher(params, json));
        }
      })
  };
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


function errorNumericalComparisonDispatcher(json) {
  return {
    type: ERROR_NUMERICAL_COMPARISON,
    message: json.error
  };
}

export function runNumericalComparison(projectId, datasetId, independentVariableNames, independence, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      variableNames: independentVariableNames,
      independence: independence
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  return (dispatch) => {
    dispatch(requestNumericalComparisonDispatcher);
    return fetch('/statistics/v1/numerical_comparison', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveNumericalComparisonDispatcher(json)))
      .catch(err => {
        dispatch(errorNumericalComparisonDispatcher(err));
        console.error("Error performing numerical comparison: ", err);
      });
  };
}

function requestAnovaDispatcher(datasetId) {
  return {
    type: REQUEST_ANOVA
  };
}

function receiveAnovaDispatcher(json) {
  return {
    type: RECEIVE_ANOVA,
    data: json,
    receivedAt: Date.now()
  };
}

function errorAnovaDispatcher(json) {
  return {
    type: RECEIVE_ANOVA,
    message: json.error,
  };
}

export function runAnova(projectId, datasetId, independentVariableNames, dependentVariableNames, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      independentVariables: independentVariableNames,
      dependentVariables: dependentVariableNames,
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  return (dispatch) => {
    dispatch(requestAnovaDispatcher);
    return fetch('/statistics/v1/anova', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveAnovaDispatcher(json)))
      .catch(err => {
        dispatch(dispatch(errorAnovaDispatcher(err)))
        console.error("Error performing anova: ", err);
      });
  };
}

function requestAnovaBoxplotDispatcher(datasetId) {
  return {
    type: REQUEST_ANOVA_BOXPLOT_DATA
  };
}

function receiveAnovaBoxplotDispatcher(json) {
  return {
    type: RECEIVE_ANOVA_BOXPLOT_DATA,
    data: json,
    receivedAt: Date.now()
  };
}

function errorAnovaBoxplotDispatcher(json) {
  return {
    type: ERROR_ANOVA_BOXPLOT_DATA,
    message: json.error
  };
}

export function getAnovaBoxplotData(projectId, datasetId, independentVariableNames, dependentVariableNames, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      independentVariables: independentVariableNames,
      dependentVariables: dependentVariableNames,
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);

  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  return (dispatch) => {
    dispatch(requestAnovaBoxplotDispatcher);
    return fetch('/statistics/v1/anova_boxplot', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveAnovaBoxplotDispatcher(json)))
      .catch(err => {
        dispatch(errorCorrelationDispatcher(err));
        console.error("Error getting ANOVA boxplot: ", err);
      });
  };
}

function requestPairwiseComparisonDispatcher(datasetId) {
  return {
    type: REQUEST_PAIRWISE_COMPARISON_DATA
  };
}

function receivePairwiseComparisonDispatcher(json) {
  return {
    type: RECEIVE_PAIRWISE_COMPARISON_DATA,
    data: json,
    receivedAt: Date.now()
  };
}

function errorPairwiseComparisonDispatcher(json) {
  return {
    type: RECEIVE_PAIRWISE_COMPARISON_DATA,
    error: json.message
  };
}

export function getPairwiseComparisonData(projectId, datasetId, independentVariableNames, dependentVariableNames, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      independentVariables: independentVariableNames,
      dependentVariables: dependentVariableNames,
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);

  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  return (dispatch) => {
    dispatch(requestPairwiseComparisonDispatcher());
    return fetch('/statistics/v1/pairwise_comparison', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receivePairwiseComparisonDispatcher(json)))
      .catch(err => {
        dispatch(errorPairwiseComparisonDispatcher(err))
        console.error("Error getting pairwise comparison: ", err);
      });
  };
}


function requestCreateExportedComparisonDispatcher(action) {
  return {
    type: action
  };
}

function receiveCreatedExportedComparisonDispatcher(action, json) {
  return {
    type: action,
    exportedComparisonId: json.id,
    exportedSpec: json,
    receivedAt: Date.now()
  };
}

export function createExportedComparison(projectId, comparisonId, data, conditionals=[], config={}, saveAction = false) {
  const requestAction = saveAction ? REQUEST_CREATE_SAVED_COMPARISON : REQUEST_CREATE_EXPORTED_COMPARISON;
  const receiveAction = saveAction ? RECEIVE_CREATED_SAVED_COMPARISON : RECEIVE_CREATED_EXPORTED_COMPARISON;

  const filteredConditionals = getFilteredConditionals(conditionals);

  const params = {
    project_id: projectId,
    comparison_id: comparisonId,
    data: data,
    conditionals: filteredConditionals ? filteredConditionals : {},
    config: config
  }

  return dispatch => {
    dispatch(requestCreateExportedComparisonDispatcher(requestAction));
    return fetch('/exported_comparison/v1/exported_comparison', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveCreatedExportedComparisonDispatcher(receiveAction, json)))
      .catch(err => console.error("Error creating exported comparisons: ", err));
  };
}