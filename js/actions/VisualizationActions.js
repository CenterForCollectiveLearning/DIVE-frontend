import {
  REQUEST_SPECS,
  RECEIVE_SPECS,
  SELECT_DATASET
} from '../constants/ActionTypes';

import fetch from './api.js';

function requestSpecsDispatcher() {
  return {
    type: REQUEST_SPECS
  };
}

function receiveSpecsDispatcher(projectId, datasetId, json) {
  return {
    type: RECEIVE_SPECS,
    projectId: projectId,
    datasetId: datasetId,
    specs: json.specs,
    receivedAt: Date.now()
  };
}

function fetchSpecs(projectId, datasetId) {
  return dispatch => {
    dispatch(requestSpecsDispatcher());
    return fetch(`/specs/v1/specs?pID=${projectId}&dID=${datasetId}`)
      .then(response => response.json())
      .then(json => dispatch(receiveSpecsDispatcher(projectId, datasetId, json)));
  };
}

function shouldFetchSpecs(state) {
  const specs = state.specs;
  if (specs.items.length > 0 || specs.isFetching) {
    return false;
  }
  return true;
}

export function fetchSpecsIfNeeded(projectId, datasetId) {
  return (dispatch, getState) => {
    if (shouldFetchSpecs(getState())) {
      return dispatch(fetchSpecs(projectId, datasetId));
    }
  };
}

export function selectDataset(datasetId) {
  return {
    type: SELECT_DATASET,
    datasetId: datasetId
  };
}

// specs/v1/specs?dID=5601bfafb9f5bc1f9d936dfb&pID=5601bf66b9f5bc1f9d9
