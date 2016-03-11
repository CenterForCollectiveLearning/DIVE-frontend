import {
  SELECT_SUMMARY_AGGREGATION_VARIABLE,
  SELECT_SUMMARY_INDEPENDENT_VARIABLE,
  SELECT_SUMMARY_AGGREGATION_FUNCTION,
  SELECT_SUMMARY_AGGREGATION_WEIGHT_VARIABLE,
  REQUEST_AGGREGATION,
  RECEIVE_AGGREGATION,
  PROGRESS_AGGREGATION,
  ERROR_AGGREGATION,
  REQUEST_ONE_D_COMPARISON,
  RECEIVE_ONE_D_COMPARISON,
  PROGRESS_ONE_D_COMPARISON,
  ERROR_ONE_D_COMPARISON,
  REQUEST_SUMMARY_STATISTICS,
  RECEIVE_SUMMARY_STATISTICS,
  PROGRESS_SUMMARY_STATISTICS,
  ERROR_SUMMARY_STATISTICS
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';

export function selectSummaryIndependentVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_SUMMARY_INDEPENDENT_VARIABLE,
    comparisonIndependentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationVariable(selectedAggregationVariableId) {
  return {
    type: SELECT_SUMMARY_AGGREGATION_VARIABLE,
    comparisonAggregationVariableId: selectedAggregationVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationWeightVariable(selectedWeightVariableId) {
  return {
    type: SELECT_SUMMARY_AGGREGATION_WEIGHT_VARIABLE,
    aggregationWeightVariableId: selectedWeightVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationFunction(selectedAggregationFunction) {
  return {
    type: SELECT_SUMMARY_AGGREGATION_FUNCTION,
    aggregationFunction: selectedAggregationFunction,
    selectedAt: Date.now()
  }
}

function requestAggregationDispatcher(datasetId) {
  return {
    type: REQUEST_AGGREGATION
  };
}

function receiveAggregationDispatcher(params, json) {
  return {
    type: RECEIVE_AGGREGATION,
    data: json,
    receivedAt: Date.now()
  };
}

function progressAggregationDispatcher(data) {
  return {
    type: PROGRESS_AGGREGATION,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorAggregationDispatcher(json) {
  return {
    type: PROGRESS_AGGREGATION,
    progress: 'Error calculating aggregation table, please check console.'
  };
}

export function runAggregation(projectId, datasetId, aggregationVariable, comparisonVariables) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: aggregationVariable,
      comparisonVariables: comparisonVariables
    }
  }

  return (dispatch) => {
    dispatch(requestAggregationDispatcher());
    return fetch('/statistics/v1/contingency_table', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_AGGREGATION, params, receiveAggregationDispatcher, progressAggregationDispatcher, errorAggregationDispatcher));
        } else {
          dispatch(receiveAggregationDispatcher(dispatchParams, json));
        }
      })
      .catch(err => console.error("Error creating contingency table: ", err));
  };
}

function requestOneDComparisonDispatcher(datasetId) {
  return {
    type: REQUEST_ONE_D_COMPARISON
  };
}

function receiveOneDComparisonDispatcher(params, json) {
  return {
    type: RECEIVE_ONE_D_COMPARISON,
    data: json,
    receivedAt: Date.now()
  };
}

function progressOneDComparisonDispatcher(data) {
  return {
    type: PROGRESS_ONE_D_COMPARISON,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorOneDComparisonDispatcher(json) {
  return {
    type: PROGRESS_ONE_D_COMPARISON,
    progress: 'Error calculating one-dimension aggregation table, please check console.'
  };
}

export function runComparisonOneDimensional(projectId, datasetId, aggregationVariable, comparisonVariables) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: aggregationVariable,
      comparisonVariable: comparisonVariables[0]
    }
  }

  return (dispatch) => {
    dispatch(requestOneDComparisonDispatcher());
    return fetch('/statistics/v1/one_dimensional_contingency_table', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_ONE_D_COMPARISON, params, receiveOneDComparisonDispatcher, progressOneDComparisonDispatcher, errorOneDComparisonDispatcher));
        } else {
          dispatch(receiveOneDComparisonDispatcher(dispatchParams, json));
        }
      })
      .catch(err => console.error("Error creating contingency table: ", err));
  };
}

function requestSummaryStatisticsDispatcher(datasetId) {
  return {
    type: REQUEST_SUMMARY_STATISTICS
  };
}

function receiveSummaryStatisticsDispatcher(params, json) {
  return {
    type: RECEIVE_SUMMARY_STATISTICS,
    data: json,
    receivedAt: Date.now()
  };
}

function progressSummaryStatisticsDispatcher(data) {
  return {
    type: PROGRESS_SUMMARY_STATISTICS,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorSummaryStatisticsDispatcher(json) {
  return {
    type: PROGRESS_SUMMARY_STATISTICS,
    progress: 'Error calculating summary statistics, please check console.'
  };
}

export function getVariableSummaryStatistics(projectId, datasetId, aggregationVariableIds) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      fieldIds: aggregationVariableIds
    }
  }

  return (dispatch) => {
    dispatch(requestSummaryStatisticsDispatcher());
    return fetch('/statistics/v1/summary_stats', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_SUMMARY_STATISTICS, params, receiveSummaryStatisticsDispatcher, progressSummaryStatisticsDispatcher, errorSummaryStatisticsDispatcher));
        } else {
          dispatch(receiveSummaryStatisticsDispatcher(dispatchParams, json));
        }
      })
      .catch(err => console.error('Error creating summary table: ', err));
  };
}
