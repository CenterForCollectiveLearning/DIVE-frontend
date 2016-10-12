import {
  SELECT_DATASET,
  REQUEST_DATASET,
  RECEIVE_DATASET,
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  DELETED_DATASET,
  REQUEST_UPLOAD_DATASET,
  PROGRESS_UPLOAD_DATASET,
  ERROR_UPLOAD_DATASET,
  RECEIVE_UPLOAD_DATASET,
  PROGRESS_TRANSFORM,
  REQUEST_REDUCE_DATASET_COLUMNS,
  REQUEST_MERGE_DATASETS,
  SELECT_DATASET_LAYOUT_TYPE
} from '../constants/ActionTypes';

import { fetch, httpRequest, pollForTask } from './api.js';
import { formatTableData } from './ActionHelpers.js'

export function selectLayoutType(layoutType) {
  return {
    type: SELECT_DATASET_LAYOUT_TYPE,
    layoutType: layoutType
  };
}

export function selectDataset(projectId, datasetId) {
  return {
    type: SELECT_DATASET,
    projectId: projectId,
    datasetId: datasetId
  };
}

function requestDatasetsDispatcher(projectId) {
  return {
    type: REQUEST_DATASETS,
    projectId: projectId
  };
}

function receiveDatasetsDispatcher(projectId, json, setSelector) {
  return {
    type: RECEIVE_DATASETS,
    projectId: projectId,
    datasets: json.datasets,
    receivedAt: Date.now(),
    setSelector: setSelector
  };
}

export function fetchDatasets(projectId, setSelector = true) {
  return dispatch => {
    dispatch(requestDatasetsDispatcher(projectId));
    return fetch('/datasets/v1/datasets?project_id=' + projectId)
      .then(json => dispatch(receiveDatasetsDispatcher(projectId, json, setSelector)));
  };
}

function requestUploadDatasetDispatcher() {
  return {
    type: REQUEST_UPLOAD_DATASET
  };
}

function progressUploadDatasetDispatcher(event) {
  const percent = event.loaded ? ( ' ' + Math.round(event.loaded / event.total * 100) + '%') : ''
  return {
    type: PROGRESS_UPLOAD_DATASET,
    progress: `Uploading dataset…${ percent }`
  }
}

function progressTaskUploadDatasetDispatcher(data) {
  return {
    type: PROGRESS_UPLOAD_DATASET,
    progress:  data.currentTask
  }
}

function errorTaskUploadDatasetDispatcher(event) {
  console.log(event);
  return {
    type: ERROR_UPLOAD_DATASET,
    error: 'Error uploading dataset ☹'
  }
}

function receiveUploadDatasetDispatcher(params, json) {
  if (json) {
    return {
      type: RECEIVE_UPLOAD_DATASET,
      datasets: [{ datasetId: json.datasetId }],
      projectId: params.projectId,
      error: null
    };
  }
  return {
    type: RECEIVE_UPLOAD_DATASET,
    datasets: [],
    projectId: params.projectId,
    error: "Sorry, this dataset is too large for us to process right now."
  };
}

export function uploadDataset(projectId, datasetFile) {
  var formData = new FormData();
  formData.append('data', JSON.stringify({ project_id: projectId }));
  formData.append('file', datasetFile);

  return (dispatch) => {
    dispatch(requestUploadDatasetDispatcher());

    const uploadEvents = [
      {
        type: 'progress',
        function: (event) => {
          dispatch(progressUploadDatasetDispatcher(event));
        }
      },
      {
        type: 'error',
        function: (event) => {
          dispatch(errorTaskUploadDatasetDispatcher(event));
        }
      },
    ];

    const completeEvent = (request) => (evt) => {
      const { taskId } = JSON.parse(request.responseText);
      dispatch(pollForTask(taskId, REQUEST_UPLOAD_DATASET, {}, receiveUploadDatasetDispatcher, progressTaskUploadDatasetDispatcher, errorTaskUploadDatasetDispatcher));
    };

    return httpRequest('POST', '/datasets/v1/upload', formData, completeEvent, uploadEvents);
  };
}

function requestDatasetDispatcher(projectId, datasetId) {
  return {
    type: REQUEST_DATASET,
    projectId: projectId,
    datasetId: datasetId
  };
}

function receiveDatasetDispatcher(params, json) {
  return {
    type: RECEIVE_DATASET,
    datasetId: json.datasetId,
    projectId: json.projectId,
    title: json.title,
    details: json.details,
    data: json.details ? formatTableData(json.details.fieldNames, json.details.sample) : []
  }
}

export function fetchDataset(projectId, datasetId) {
  return (dispatch) => {
    dispatch(requestDatasetDispatcher(projectId, datasetId));
    return fetch(`/datasets/v1/datasets/${ datasetId }?project_id=${projectId}`)
      .then(json => dispatch(receiveDatasetDispatcher({}, json)));
  };
}

function deletedDatasetDispatcher(datasetId, json) {
  return {
    type: DELETED_DATASET,
    datasetId: datasetId
  };
}

export function deleteDataset(projectId, datasetId) {
  return (dispatch) => {
    return fetch(`/datasets/v1/datasets/${ datasetId }?project_id=${ projectId }`, {
      method: 'delete'
    }).then(json => dispatch(deletedDatasetDispatcher(datasetId, json)));
  };
}

function progressTransformDispatcher(data) {
  return {
    type: PROGRESS_TRANSFORM,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorTransformDispatcher(data) {
  return {
    type: ERROR_TRANSFORM,
    progress: 'Error transforming dataset, please check console.'
  };
}

export function requestReduceDatasetColumnsDispatcher(datasetId, columnIds) {
  return {
    type: REQUEST_REDUCE_DATASET_COLUMNS,
    datasetId: datasetId,
    columnIds: columnIds
  };
}

export function reduceDatasetColumns(projectId, datasetId, columnIds=[]) {
  const params = {
    'project_id': projectId,
    'dataset_id': datasetId,
    'column_ids': columnIds
  };

  return (dispatch) => {
    dispatch(requestReduceDatasetColumnsDispatcher(datasetId, columnIds));
    return fetch(`/datasets/v1/reduce?project_id=${ projectId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        const dispatchParams = { projectId };
        dispatch(pollForTask(json.taskId, REQUEST_REDUCE_DATASET_COLUMNS, dispatchParams, receiveDatasetDispatcher, progressTransformDispatcher, errorTransformDispatcher));
      });
  };
}

function requestPivotDatasetColumnsDispatcher(datasetId, variableName, valueName, columnIds) {
  return {
    type: REQUEST_REDUCE_DATASET_COLUMNS,
    datasetId: datasetId,
    columnIds: columnIds,
    variableName: variableName,
    valueName: valueName
  };
}

export function pivotDatasetColumns(projectId, datasetId, variableName, valueName, columnIds=[]) {
  const params = {
    project_id: projectId,
    dataset_id: datasetId,
    pivot_fields: columnIds,
    variable_name: variableName,
    value_name: valueName
  };

  return (dispatch) => {
    dispatch(requestPivotDatasetColumnsDispatcher(datasetId, variableName, valueName, columnIds));
    return fetch(`/datasets/v1/unpivot?project_id=${ projectId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        const dispatchParams = { projectId };
        dispatch(pollForTask(json.taskId, REQUEST_REDUCE_DATASET_COLUMNS, dispatchParams, receiveDatasetDispatcher, progressTransformDispatcher, errorTransformDispatcher));
      });
  };
}

function requestMergeDatasetsDispatcher(leftDatasetId, rightDatasetId, onColumnsIds, mergeMethod) {
  return {
    type: REQUEST_MERGE_DATASETS,
    leftDatasetId: leftDatasetId,
    rightDatasetId: rightDatasetId,
    onColumnsIds: onColumnsIds,
    mergeMethod: mergeMethod
  };
}

export function mergeDatasets(projectId, leftDatasetId, rightDatasetId, onColumnsIds=[], mergeMethod='left') {
  const params = {
    project_id: projectId,
    left_dataset_id: leftDatasetId,
    right_dataset_id: rightDatasetId,
    on: onColumnsIds,
    how: mergeMethod
  };

  return (dispatch) => {
    dispatch(requestMergeDatasetsDispatcher(leftDatasetId, rightDatasetId, onColumnsIds, mergeMethod));
    return fetch(`/datasets/v1/join?project_id=${ projectId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        const dispatchParams = {};
        dispatch(pollForTask(json.taskId, REQUEST_MERGE_DATASETS, dispatchParams, receiveDatasetDispatcher, progressTransformDispatcher));
      });
  };
}
