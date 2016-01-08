import {
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,
  SELECT_COMPARISON_DEPENDENT_VARIABLE,
  REQUEST_CREATE_CONTINGENCY,
  RECEIVE_CREATE_CONTINGENCY
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
