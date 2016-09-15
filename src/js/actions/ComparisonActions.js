import {
  SELECT_COMPARISON_INDEPENDENT_VARIABLES,
  SELECT_COMPARISON_DEPENDENT_VARIABLES,
  REQUEST_NUMERICAL_COMPARISON,
  RECEIVE_NUMERICAL_COMPARISON,
  UPDATE_COMPARISON_INPUT,
  REQUEST_ANOVA,
  RECEIVE_ANOVA,
  REQUEST_ANOVA_BOXPLOT_DATA,
  RECEIVE_ANOVA_BOXPLOT_DATA,
  REQUEST_PAIRWISE_COMPARISON_DATA,
  RECEIVE_PAIRWISE_COMPARISON_DATA,
  SELECT_CONDITIONAL
} from '../constants/ActionTypes';

import { fetch } from './api.js';
import { getFilteredConditionals } from './ActionHelpers.js'


export function selectConditional(conditional) {
  return {
    type: SELECT_CONDITIONAL,
    conditional: conditional
  }
}

export function selectIndependentVariables(selectedVariableIds) {
  return {
    type: SELECT_COMPARISON_INDEPENDENT_VARIABLES,
    independentVariableIds: selectedVariableIds,
    selectedAt: Date.now()
  }
}

export function selectDependentVariables(selectedVariableIds) {
  return {
    type: SELECT_COMPARISON_DEPENDENT_VARIABLES,
    dependentVariableIds: selectedVariableIds,
    selectedAt: Date.now()
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
