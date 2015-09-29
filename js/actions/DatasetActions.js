import {
  REQUEST_DATASET,
  RECEIVE_DATASET,
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  REQUEST_UPLOAD_DATASET,
  RECEIVE_UPLOAD_DATASET
} from '../constants/ActionTypes';

import fetch from './api.js';
import { formatTableData } from './ActionHelpers.js'

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
  if (datasets.items.length > 0 || datasets.isFetching) {
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

function receiveUploadDatasetDispatcher(json) {
  return {
    type: RECEIVE_UPLOAD_DATASET,
    datasetId: json.datasetIds[0]
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
      .then(json => dispatch(receiveUploadDatasetDispatcher(json)));
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
    data: formatTableData(json.details.fieldNames, json.details.sample)
  };
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
