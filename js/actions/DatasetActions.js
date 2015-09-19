import {
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  REQUEST_UPLOAD_DATASET,
  RECEIVE_UPLOAD_DATASET
} from '../constants/ActionTypes';

import fetch from './api.js';

function requestDatasetsDispatcher() {
  return {
    type: REQUEST_DATASETS
  };
}

function receiveDatasetsDispatcher(projectID, json) {
  return {
    type: RECEIVE_DATASETS,
    projectID: projectID,
    datasets: json.datasets,
    receivedAt: Date.now()
  };
}

function fetchDatasets(projectID) {
  return dispatch => {
    dispatch(requestDatasetsDispatcher());
    return fetch('/datasets?pID=' + projectID)
      .then(response => response.json())
      .then(json => dispatch(receiveDatasetsDispatcher(projectID, json)));
  };
}

function shouldFetchDatasets(state) {
  const datasets = state.datasets;
  if (datasets.items.length > 0 || datasets.isFetching) {
    return false;
  }
  return true;
}

export function fetchDatasetsIfNeeded(projectID) {
  return (dispatch, getState) => {
    if (shouldFetchDatasets(getState())) {
      return dispatch(fetchDatasets(projectID));
    }
  };
}

function uploadDatasetDispatcher() {
  return {
    type: REQUEST_UPLOAD_DATASET
  };
}

function uploadDatasetResponseDispatcher(json) {
  return {
    type: RECEIVE_UPLOAD_DATASET,
    dataset: json.datasets[0]
  };
}

export function uploadDataset(projectID, datasetFile) {
  var formData = new FormData();
  formData.append('data', JSON.stringify({ pID: projectID }));
  formData.append('file', datasetFile);

  return (dispatch) => {
    dispatch(uploadDatasetDispatcher());
    return fetch('/upload', {
      method: 'post',
      body: formData
    }).then(response => response.json())
      .then(json => dispatch(uploadDatasetResponseDispatcher(json)));
  };
}
