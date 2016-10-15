import _ from 'underscore';

import {
  REQUEST_NUMERICAL_COMPARISON,
  RECEIVE_NUMERICAL_COMPARISON,
  UPDATE_COMPARISON_INPUT,
  REQUEST_ANOVA,
  RECEIVE_ANOVA,
  REQUEST_ANOVA_BOXPLOT_DATA,
  RECEIVE_ANOVA_BOXPLOT_DATA,
  REQUEST_PAIRWISE_COMPARISON_DATA,
  RECEIVE_PAIRWISE_COMPARISON_DATA,
  SELECT_CONDITIONAL,
  SET_COMPARISON_QUERY_STRING
} from '../constants/ActionTypes';

import { fetch } from './api.js';
import { getFilteredConditionals } from './ActionHelpers.js'

export function getInitialComparisonState(projectId, datasetId, fieldProperties) {
  var categoricalItemIds = fieldProperties.filter((item) => ((item.generalType == 'c') && (!item.isId))).map((item) => item.id);
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

export function setComparisonQueryString(queryString) {
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
      .catch(err => console.error("Error performing numerical comparison: ", err));
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
      .catch(err => console.error("Error performing anova: ", err));
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
      .catch(err => console.error("Error getting ANOVA boxplot: ", err));
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
    dispatch(requestPairwiseComparisonDispatcher);
    return fetch('/statistics/v1/pairwise_comparison', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receivePairwiseComparisonDispatcher(json)))
      .catch(err => console.error("Error getting pairwise comparison: ", err));
  };
}
