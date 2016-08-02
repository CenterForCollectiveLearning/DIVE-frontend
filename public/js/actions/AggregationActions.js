import {
  SELECT_AGGREGATION_AGGREGATION_VARIABLE,
  SELECT_AGGREGATION_INDEPENDENT_VARIABLE,
  SELECT_AGGREGATION_AGGREGATION_FUNCTION,
  SELECT_AGGREGATION_AGGREGATION_WEIGHT_VARIABLE,
  REQUEST_AGGREGATION,
  RECEIVE_AGGREGATION,
  PROGRESS_AGGREGATION,
  ERROR_AGGREGATION,
  REQUEST_ONE_D_COMPARISON,
  RECEIVE_ONE_D_COMPARISON,
  PROGRESS_ONE_D_COMPARISON,
  ERROR_ONE_D_COMPARISON,
  REQUEST_AGGREGATION_STATISTICS,
  RECEIVE_AGGREGATION_STATISTICS,
  SELECT_AGGREGATION_CONFIG_X,
  SELECT_AGGREGATION_CONFIG_Y,
  PROGRESS_AGGREGATION_STATISTICS,
  ERROR_AGGREGATION_STATISTICS
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';

export function selectAggregationIndependentVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_AGGREGATION_INDEPENDENT_VARIABLE,
    comparisonIndependentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationVariable(selectedAggregationVariableId) {
  return {
    type: SELECT_AGGREGATION_AGGREGATION_VARIABLE,
    comparisonAggregationVariableId: selectedAggregationVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationWeightVariable(selectedWeightVariableId) {
  return {
    type: SELECT_AGGREGATION_AGGREGATION_WEIGHT_VARIABLE,
    aggregationWeightVariableId: selectedWeightVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationFunction(selectedAggregationFunction) {
  return {
    type: SELECT_AGGREGATION_AGGREGATION_FUNCTION,
    aggregationFunction: selectedAggregationFunction,
    selectedAt: Date.now()
  }
}

export function selectBinningConfigX(config) {
  return {
    type: SELECT_AGGREGATION_CONFIG_X,
    config: config
  }
}

export function selectBinningConfigY(config) {
  return {
    type: SELECT_AGGREGATION_CONFIG_Y,
    config: config
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
    }).then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_AGGREGATION, params, receiveAggregationDispatcher, progressAggregationDispatcher, errorAggregationDispatcher));
        } else {
          dispatch(receiveAggregationDispatcher(params, json));
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
    }).then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_ONE_D_COMPARISON, params, receiveOneDComparisonDispatcher, progressOneDComparisonDispatcher, errorOneDComparisonDispatcher));
        } else {
          dispatch(receiveOneDComparisonDispatcher(params, json));
        }
      })
  };
}

function requestAggregationStatisticsDispatcher(datasetId) {
  return {
    type: REQUEST_AGGREGATION_STATISTICS
  };
}

function receiveAggregationDispatcherStatisticsDispatcher(params, json) {
  return {
    type: RECEIVE_AGGREGATION_STATISTICS,
    data: json,
    receivedAt: Date.now()
  };
}

function progressAggregationStatisticsDispatcher(data) {
  return {
    type: PROGRESS_AGGREGATION_STATISTICS,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorAggregationStatisticsDispatcher(json) {
  return {
    type: PROGRESS_AGGREGATION_STATISTICS,
    progress: 'Error calculating aggregations, please check console.'
  };
}

export function getVariableAggregationStatistics(projectId, datasetId, aggregationVariableIds) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      fieldIds: aggregationVariableIds
    }
  }

  return (dispatch) => {
    dispatch(requestAggregationStatisticsDispatcher());
    return fetch('/statistics/v1/summary_stats', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_AGGREGATION_STATISTICS, params, receiveAggregationDispatcherStatisticsDispatcher, progressAggregationStatisticsDispatcher, errorAggregationStatisticsDispatcher));
        } else {
          dispatch(receiveAggregationDispatcherStatisticsDispatcher(params, json));
        }
      })
  };
}
