import _ from 'underscore';

import {
  AGGREGATION_MODE,
  SELECT_AGGREGATION_DEPENDENT_VARIABLE,
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
  REQUEST_CREATE_SAVED_AGGREGATION,
  RECEIVE_CREATED_SAVED_AGGREGATION,
  REQUEST_CREATE_EXPORTED_AGGREGATION,
  RECEIVE_CREATED_EXPORTED_AGGREGATION,  
  SELECT_CONDITIONAL,
  SET_AGGREGATION_QUERY_STRING
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';
import { getFilteredConditionals } from './ActionHelpers.js'

export function getInitialState(projectId, datasetId, fieldProperties) {
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
    aggregateOn: 'count',
    aggregationVariablesIds: selectedVariablesIds
  }
}

export function setPersistedQueryString(queryString) {
  return {
    type: SET_AGGREGATION_QUERY_STRING,
    queryString: queryString
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
    type: ERROR_AGGREGATION,
    message: json.error
  };
}

export function runAggregation(projectId, datasetId, aggregationVariablesNames, dependentVariableName, aggregationFunction, weightVariableName, binningConfigX, binningConfigY, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariableName: dependentVariableName,
      aggregationVariablesNames: aggregationVariablesNames,
      aggregationFunction: aggregationFunction,
      weightVariableName: weightVariableName,
      binningConfigX: binningConfigX,
      binningConfigY: binningConfigY, 
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  const dispatchers = {
    success: receiveAggregationDispatcher,
    progress: progressAggregationDispatcher,
    error: errorAggregationDispatcher
  }

  return (dispatch) => {
    dispatch(requestAggregationDispatcher());
    return fetch('/statistics/v1/aggregation', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, AGGREGATION_MODE, REQUEST_AGGREGATION, params, dispatchers));
        } else {
          dispatch(receiveAggregationDispatcher(params, json));
        }
      })
      .catch(err => console.error("Error running aggregation: ", err));
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

export function createExportedAggregation(projectId, aggregationId, data, conditionals=[], config={}, saveAction = false) {
  const requestAction = saveAction ? REQUEST_CREATE_SAVED_AGGREGATION : REQUEST_CREATE_EXPORTED_AGGREGATION;
  const receiveAction = saveAction ? RECEIVE_CREATED_SAVED_AGGREGATION : RECEIVE_CREATED_EXPORTED_AGGREGATION;

  const filteredConditionals = getFilteredConditionals(conditionals);

  const params = {
    project_id: projectId,
    aggregation_id: aggregationId,
    data: data,
    conditionals: filteredConditionals ? filteredConditionals : {},
    config: config
  }

  return dispatch => {
    dispatch(requestCreateExportedAggregationDispatcher(requestAction));
    return fetch('/exported_aggregation/v1/exported_aggregation', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveCreatedExportedAggregationDispatcher(receiveAction, json)))
      .catch(err => console.error("Error creating exported aggregations: ", err));
  };
}