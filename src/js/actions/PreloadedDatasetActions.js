import {
  REQUEST_PRELOADED_DATASETS,
  RECEIVE_PRELOADED_DATASETS,
  SELECT_PRELOADED_DATASET,
  REQUEST_SELECT_PRELOADED_DATASET,
  RECEIVE_SELECT_PRELOADED_DATASET
} from '../constants/ActionTypes';

import { fetch, httpRequest, pollForTask } from './api.js';

function requestPreloadedDatasetsDispatcher() {
  return {
    type: REQUEST_PRELOADED_DATASETS
  };
}

function receivePreloadedDatasetsDispatcher(json) {
  return {
    type: RECEIVE_PRELOADED_DATASETS,
    datasets: json.datasets,
    receivedAt: Date.now()
  };
}

export function fetchPreloadedDatasets() {
  return dispatch => {
    dispatch(requestPreloadedDatasetsDispatcher());
    return fetch('/datasets/v1/preloaded_datasets')
      .then(json => dispatch(receivePreloadedDatasetsDispatcher(json)));
  };
}

function requestSelectPreloadedDatasetDispatcher() {
  return {
    type: REQUEST_SELECT_PRELOADED_DATASET
  };
}

function receiveSelectPreloadedDatasetDispatcher(json) {
  console.log(json);
  return {
    type: RECEIVE_SELECT_PRELOADED_DATASET,
    receivedAt: Date.now()
  };
}

export function selectPreloadedDataset(projectId, datasetId) {
  return dispatch => {
    dispatch(requestSelectPreloadedDatasetDispatcher());
    return fetch(`/datasets/v1/select_preloaded_dataset?project_id=${ projectId }&dataset_id=${ datasetId }`)
      .then(json => dispatch(receiveSelectPreloadedDatasetDispatcher(json)));
  };
}
