import {
  SELECT_SEGMENTATION_SEGMENTATION_VARIABLE,
  SELECT_SEGMENTATION_INDEPENDENT_VARIABLE,
  SELECT_SEGMENTATION_SEGMENTATION_FUNCTION,
  SELECT_SEGMENTATION_SEGMENTATION_WEIGHT_VARIABLE,
  REQUEST_SEGMENTATION,
  RECEIVE_SEGMENTATION,
  PROGRESS_SEGMENTATION,
  ERROR_SEGMENTATION,
  REQUEST_ONE_D_SEGMENTATION,
  RECEIVE_ONE_D_SEGMENTATION,
  PROGRESS_ONE_D_SEGMENTATION,
  ERROR_ONE_D_SEGMENTATION,
  REQUEST_SEGMENTATION_STATISTICS,
  RECEIVE_SEGMENTATION_STATISTICS,
  SELECT_SEGMENTATION_CONFIG_X,
  SELECT_SEGMENTATION_CONFIG_Y,
  PROGRESS_SEGMENTATION_STATISTICS,
  ERROR_SEGMENTATION_STATISTICS,
  SELECT_CONDITIONAL
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';
import { getFilteredConditionals } from './ActionHelpers.js'

export function selectConditional(conditional) {
  return {
    type: SELECT_CONDITIONAL,
    conditional: conditional
  }
}

export function selectSegmentationIndependentVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_SEGMENTATION_INDEPENDENT_VARIABLE,
    segmentationIndependentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}

export function selectSegmentationVariable(selectedSegmentationVariableId) {
  return {
    type: SELECT_SEGMENTATION_SEGMENTATION_VARIABLE,
    segmentationSegmentationVariableId: selectedSegmentationVariableId,
    selectedAt: Date.now()
  }
}

export function selectSegmentationWeightVariable(selectedWeightVariableId) {
  return {
    type: SELECT_SEGMENTATION_SEGMENTATION_WEIGHT_VARIABLE,
    segmentationWeightVariableId: selectedWeightVariableId,
    selectedAt: Date.now()
  }
}

export function selectSegmentationFunction(selectedSegmentationFunction) {
  return {
    type: SELECT_SEGMENTATION_SEGMENTATION_FUNCTION,
    segmentationFunction: selectedSegmentationFunction,
    selectedAt: Date.now()
  }
}

export function selectBinningConfigX(config) {
  return {
    type: SELECT_SEGMENTATION_CONFIG_X,
    config: config
  }
}

export function selectBinningConfigY(config) {
  return {
    type: SELECT_SEGMENTATION_CONFIG_Y,
    config: config
  }
}

function requestSegmentationDispatcher(datasetId) {
  return {
    type: REQUEST_SEGMENTATION
  };
}

function receiveSegmentationDispatcher(params, json) {
  return {
    type: RECEIVE_SEGMENTATION,
    data: json,
    receivedAt: Date.now()
  };
}

function progressSegmentationDispatcher(data) {
  return {
    type: PROGRESS_SEGMENTATION,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorSegmentationDispatcher(json) {
  return {
    type: PROGRESS_SEGMENTATION,
    progress: 'Error calculating segmentation table, please check console.'
  };
}

export function runSegmentation(projectId, datasetId, segmentationVariable, segmentationVariables, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: segmentationVariable,
      aggregationVariables: segmentationVariables
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  return (dispatch) => {
    dispatch(requestSegmentationDispatcher());
    return fetch('/statistics/v1/contingency_table', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_SEGMENTATION, params, receiveSegmentationDispatcher, progressSegmentationDispatcher, errorSegmentationDispatcher));
        } else {
          dispatch(receiveSegmentationDispatcher(params, json));
        }
      })
      .catch(err => console.error("Error creating contingency table: ", err));
  };
}

function requestOneDSegmentationDispatcher(datasetId) {
  return {
    type: REQUEST_ONE_D_SEGMENTATION
  };
}

function receiveOneDSegmentationDispatcher(params, json) {
  return {
    type: RECEIVE_ONE_D_SEGMENTATION,
    data: json,
    receivedAt: Date.now()
  };
}

function progressOneDSegmentationDispatcher(data) {
  return {
    type: PROGRESS_ONE_D_SEGMENTATION,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorOneDSegmentationDispatcher(json) {
  return {
    type: PROGRESS_ONE_D_SEGMENTATION,
    progress: 'Error calculating one dimensional segmentation table, please check console.'
  };
}

export function runSegmentationOneDimensional(projectId, datasetId, segmentationVariable, segmentationVariables, conditionals=[]) {
  const params = {
    projectId: projectId,
    spec: {
      datasetId: datasetId,
      dependentVariable: segmentationVariable,
      segmentationVariable: segmentationVariables[0]
    }
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  return (dispatch) => {
    dispatch(requestOneDSegmentationDispatcher());
    return fetch('/statistics/v1/one_dimensional_contingency_table', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_ONE_D_SEGMENTATION, params, receiveOneDSegmentationDispatcher, progressOneDSegmentationDispatcher, errorOneDSegmentationDispatcher));
        } else {
          dispatch(receiveOneDSegmentationDispatcher(params, json));
        }
      })
  };
}
