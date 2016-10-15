import _ from 'underscore';

import {
  SELECT_AGGREGATION_AGGREGATION_VARIABLE,
  SELECT_AGGREGATION_INDEPENDENT_VARIABLE,
  SELECT_AGGREGATION_AGGREGATION_FUNCTION,
  SELECT_AGGREGATION_AGGREGATION_WEIGHT_VARIABLE,
  REQUEST_AGGREGATION,
  RECEIVE_AGGREGATION,
  PROGRESS_AGGREGATION,
  ERROR_AGGREGATION,
  REQUEST_ONE_D_AGGREGATION,
  RECEIVE_ONE_D_AGGREGATION,
  PROGRESS_ONE_D_AGGREGATION,
  ERROR_ONE_D_AGGREGATION,
  REQUEST_AGGREGATION_STATISTICS,
  RECEIVE_AGGREGATION_STATISTICS,
  SELECT_AGGREGATION_CONFIG_X,
  SELECT_AGGREGATION_CONFIG_Y,
  PROGRESS_AGGREGATION_STATISTICS,
  ERROR_AGGREGATION_STATISTICS,
  SELECT_CONDITIONAL,
  SET_AGGREGATION_QUERY_STRING
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';
import { getFilteredConditionals } from './ActionHelpers.js'

export function getInitialAggregationState(projectId, datasetId, fieldProperties) {
  var categoricalItemIds = fieldProperties.filter((item) => ((item.generalType == 'c') && (!item.isId))).map((item) => item.id);
  var quantitativeItemIds = fieldProperties.filter((item) => ((item.generalType == 'q') && (!item.isId))).map((item) => item.id);
  var n_c = categoricalItemIds.length;
  var n_q = quantitativeItemIds.length;

  var selectedVariablesIds = [];
  if (n_c >= 2) {
    selectedVariablesIds = _.sample(categoricalItemIds, 2);
  } else if (n_c = 1) {
    selectedVariablesIds = [ ..._.sample(categoricalItemIds, 1), ..._.sample(quantitativeItemIds, 1) ];
  } else if (n_c == 0) {
    if (n_q >= 2) {
      selectedVariablesIds = _.sample(quantitativeItemIds, 2);
    }
  }


  return {
    aggregationVariablesIds: selectedVariablesIds
  }
}

export function setAggregationQueryString(queryString) {
  return {
    type: SET_AGGREGATION_QUERY_STRING,
    queryString: queryString
  }
}

export function selectConditional(conditional) {
  return {
    type: SELECT_CONDITIONAL,
    conditional: conditional
  }
}

export function selectAggregationIndependentVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_AGGREGATION_INDEPENDENT_VARIABLE,
    aggregationIndependentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationVariable(selectedAggregationVariableId) {
  return {
    type: SELECT_AGGREGATION_AGGREGATION_VARIABLE,
    aggregationAggregationVariableId: selectedAggregationVariableId,
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

export function runAggregation(projectId, datasetId, aggregationVariable, aggregationVariables, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: aggregationVariable,
      aggregationVariables: aggregationVariables
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
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

function requestOneDAggregationDispatcher(datasetId) {
  return {
    type: REQUEST_ONE_D_AGGREGATION
  };
}

function receiveOneDAggregationDispatcher(params, json) {
  return {
    type: RECEIVE_ONE_D_AGGREGATION,
    data: json,
    receivedAt: Date.now()
  };
}

function progressOneDAggregationDispatcher(data) {
  return {
    type: PROGRESS_ONE_D_AGGREGATION,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorOneDAggregationDispatcher(json) {
  return {
    type: PROGRESS_ONE_D_AGGREGATION,
    progress: 'Error calculating one dimensional aggregation table, please check console.'
  };
}

export function runAggregationOneDimensional(projectId, datasetId, aggregationVariable, aggregationVariables, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: aggregationVariable,
      aggregationVariable: aggregationVariables[0]
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  return (dispatch) => {
    dispatch(requestOneDAggregationDispatcher());
    return fetch('/statistics/v1/one_dimensional_contingency_table', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_ONE_D_AGGREGATION, params, receiveOneDAggregationDispatcher, progressOneDAggregationDispatcher, errorOneDAggregationDispatcher));
        } else {
          dispatch(receiveOneDAggregationDispatcher(params, json));
        }
      })
  };
}
