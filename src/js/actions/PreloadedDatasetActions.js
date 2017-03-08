import {
  REQUEST_PRELOADED_DATASETS,
  RECEIVE_PRELOADED_DATASETS,
  SELECT_PRELOADED_DATASET,
  REQUEST_SELECT_PRELOADED_DATASET,
  RECEIVE_SELECT_PRELOADED_DATASET,
  REQUEST_DESELECT_PRELOADED_DATASET,
  RECEIVE_DESELECT_PRELOADED_DATASET
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

export function fetchPreloadedDatasets(projectId) {
  return dispatch => {
    dispatch(requestPreloadedDatasetsDispatcher());
    return fetch('/datasets/v1/preloaded_datasets' + (projectId ? `?project_id=${ projectId }` : ''))
      .then(json => dispatch(receivePreloadedDatasetsDispatcher(json)));
  };
}

function requestSelectPreloadedDatasetDispatcher() {
  return {
    type: REQUEST_SELECT_PRELOADED_DATASET
  };
}

function receiveSelectPreloadedDatasetDispatcher(json) {
  return {
    type: RECEIVE_SELECT_PRELOADED_DATASET,
    preloadedDataset: json.preloadedDataset,
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

function requestDeselectPreloadedDatasetDispatcher() {
  return {
    type: REQUEST_DESELECT_PRELOADED_DATASET
  };
}

function receiveDeselectPreloadedDatasetDispatcher(json) {
  return {
    type: RECEIVE_DESELECT_PRELOADED_DATASET,
    preloadedDataset: json.preloadedDataset,
    receivedAt: Date.now()
  };
}

export function deselectPreloadedDataset(projectId, datasetId) {
  return dispatch => {
    dispatch(requestDeselectPreloadedDatasetDispatcher());
    return fetch(`/datasets/v1/deselect_preloaded_dataset?project_id=${ projectId }&dataset_id=${ datasetId }`)
      .then(json => dispatch(receiveDeselectPreloadedDatasetDispatcher(json)));
  };
}
