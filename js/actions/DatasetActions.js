import {
  SELECT_DATASET,
  REQUEST_DATASET,
  RECEIVE_DATASET,
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  REQUEST_UPLOAD_DATASET,
  RECEIVE_UPLOAD_DATASET,
  REQUEST_REDUCE_DATASET_COLUMNS
} from '../constants/ActionTypes';

import { fetch, pollForTaskResult } from './api.js';
import { formatTableData } from './ActionHelpers.js'

export function selectDataset(datasetId) {
  return {
    type: SELECT_DATASET,
    datasetId: datasetId
  };
}

function requestDatasetsDispatcher() {
  return {
    type: REQUEST_DATASETS
  };
}

function receiveDatasetsDispatcher(projectId, json) {
  return {
    type: RECEIVE_DATASETS,
    projectId: projectId,
    datasets: json.datasets,
    receivedAt: Date.now()
  };
}

function deleteDatasetsDispatcher() {
  return {
    type: DELETE_DATASETS
  };
}

function fetchDatasets(projectId) {
  return dispatch => {
    dispatch(requestDatasetsDispatcher());
    return fetch('/datasets/v1/datasets?project_id=' + projectId)
      .then(response => response.json())
      .then(json => dispatch(receiveDatasetsDispatcher(projectId, json)));
  };
}

function shouldFetchDatasets(state) {
  const datasets = state.datasets;
  if (datasets.loaded || datasets.isFetching) {
    return false;
  }
  return true;
}

export function fetchDatasetsIfNeeded(projectId) {
  return (dispatch, getState) => {
    if (shouldFetchDatasets(getState())) {
      return dispatch(fetchDatasets(projectId));
    }
  };
}

function requestUploadDatasetDispatcher() {
  return {
    type: REQUEST_UPLOAD_DATASET
  };
}

function receiveUploadDatasetDispatcher(params, json) {
  return {
    type: RECEIVE_UPLOAD_DATASET,
    datasets: [{ datasetId: json.id }]
  };
}

export function uploadDataset(projectId, datasetFile) {
  var formData = new FormData();
  formData.append('data', JSON.stringify({ project_id: projectId }));
  formData.append('file', datasetFile);

  return (dispatch) => {
    dispatch(requestUploadDatasetDispatcher());
    return fetch('/datasets/v1/upload', {
      method: 'post',
      body: formData
    }).then(response => response.json())
      .then(function(json) {
        if (json.taskId) {
          dispatch(pollForTaskResult(json.taskId, {}, receiveUploadDatasetDispatcher))
        }
      })
  };
}

function requestDatasetDispatcher(datasetId) {
  return {
    type: REQUEST_DATASET,
    datasetId: datasetId
  };
}

function receiveDatasetDispatcher(json) {
  return {
    type: RECEIVE_DATASET,
    datasetId: json.datasetId,
    title: json.title,
    details: json.details,
    data: json.details ? formatTableData(json.details.fieldNames, json.details.sample) : []
  }
}

export function fetchDataset(projectId, datasetId) {
  return (dispatch) => {
    dispatch(requestDatasetDispatcher(datasetId));
    return fetch(`/datasets/v1/datasets/${datasetId}?project_id=${projectId}`)
      .then(response => response.json())
      .then(json => dispatch(receiveDatasetDispatcher(json)));
  };
}

export function deleteDataset(projectId, datasetId) {
  return (dispatch) => {
    dispatch(requestDatasetDispatcher(datasetId));
    return fetch(`/datasets/v1/datasets/${datasetId}?project_id=${projectId}`, {
      method: 'delete'
    }).then(response => response.json())
      .then(json => dispatch(deleteDatasetDispatcher(json)));
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
    }).then(response => response.json())
      .then(json => dispatch(receiveDatasetDispatcher(json)));
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
    }).then(response => response.json())
      .then(json => dispatch(receiveDatasetDispatcher(json)));
  };
}

function requestMergeDatasetsDispatcher(leftDatasetId, rightDatasetId, onColumnsIds, mergeMethod) {
  return {
    type: REQUEST_REDUCE_DATASET_COLUMNS,
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
  };
}
