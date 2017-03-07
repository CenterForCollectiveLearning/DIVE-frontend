import {
  REQUEST_PRELOADED_DATASETS,
  RECEIVE_PRELOADED_DATASETS,
  SELECT_PRELOADED_DATASET,
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

export function selectPreloadedDataset(projectId, datasetId) {
  return {
    type: SELECT_PRELOADED_DATASET,
    projectId: projectId,
    datasetId: datasetId
  };
}
