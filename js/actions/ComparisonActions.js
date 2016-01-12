import {
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,
  SELECT_COMPARISON_DEPENDENT_VARIABLE,
  REQUEST_CREATE_CONTINGENCY,
  RECEIVE_CREATE_CONTINGENCY,
  REQUEST_PERFORM_NUMERICAL_COMPARISON,
  RECEIVE_PERFORM_NUMERICAL_COMPARISON
} from '../constants/ActionTypes';

import { fetch } from './api.js';

export function selectIndependentVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_COMPARISON_INDEPENDENT_VARIABLE,
    independentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}

export function selectDependentVariable(selectedDependentVariableId) {
  return {
    type: SELECT_COMPARISON_DEPENDENT_VARIABLE,
    dependentVariableId: selectedDependentVariableId,
    selectedAt: Date.now()
  }
}

function requestCreateContingencyDispatcher(datasetId) {
  return {
    type: REQUEST_CREATE_CONTINGENCY
  };
}

function receiveCreateContingencyDispatcher(json) {
  return {
    type: RECEIVE_CREATE_CONTINGENCY,
    data: json,
    receivedAt: Date.now()
  };
}

export function runCreateContingency(projectId, datasetId, numericalDependentVariable, categoricalDependentVariable, numericalIndependentVariableNames, categoricalIndependentVariableNames) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      numericalDependentVariable: numericalDependentVariable,
      categoricalDependentVariable: categoricalDependentVariable,
      numericalIndependentVariableNames: numericalIndependentVariableNames,
      categoricalIndependentVariableNames: categoricalIndependentVariableNames
    }
  }

  return (dispatch) => {
    dispatch(requestCreateContingencyDispatcher());
    return fetch('/statistics/v1/contingency_table', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveCreateContingencyDispatcher(json)))
      .catch(err => console.error("Error creating contingency table: ", err));
  };
}

function requestRunNumericalComparisonDispatcher(datasetId) {
  return {
    type: REQUEST_PERFORM_NUMERICAL_COMPARISON
  };
}

function receiveRunNumericalComparisonDispatcher(json) {
  return {
    type: RECEIVE_PERFORM_NUMERICAL_COMPARISON,
    data: json,
    receivedAt: Date.now()
  };
}

export function runNumericalComparison(projectId, datasetId, numericalIndependentVariableNames, independence) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      variableNames: numericalIndependentVariableNames,
      independence: independence
    }
  }

  return (dispatch) => {
    dispatch(requestRunNumericalComparisonDispatcher);
    return fetch('/statistics/v1/numerical_comparison', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveRunNumericalComparisonDispatcher(json)))
      .catch(err => console.error("Error performing numerical comparison: ", err));
  };
}
