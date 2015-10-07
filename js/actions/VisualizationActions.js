import {
  REQUEST_SPECS,
  RECEIVE_SPECS,
  SELECT_DATASET,
  SELECT_VISUALIZATION_TYPE,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA,
  CLEAR_VISUALIZATION
} from '../constants/ActionTypes';

import fetch from './api.js';
import { formatTableData } from './ActionHelpers.js'

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

function fetchSpecs(projectId, datasetId, field_agg_pairs) {
  var json = {
    'project_id': projectId,
    'dataset_id': datasetId,
    'field_agg_pairs': field_agg_pairs,
  }
  return dispatch => {
    dispatch(requestSpecsDispatcher());
    return fetch(`/specs/v1/specs`, {
      method: 'post',
      body: JSON.stringify(json),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveSpecsDispatcher(projectId, datasetId, json)));
  };
}

function shouldFetchSpecs(state) {
  const { specs } = state;
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

export function selectVisualizationType(selectedType) {
  return {
    type: SELECT_VISUALIZATION_TYPE,
    selectedType: selectedType
  }
}

function requestSpecVisualizationDispatcher() {
  return {
    type: REQUEST_VISUALIZATION_DATA
  };
}

function receiveSpecVisualizationDispatcher(json) {
  return {
    type: RECEIVE_VISUALIZATION_DATA,
    spec: json.spec,
    tableData: formatTableData(json.visualization.table.columns, json.visualization.table.data),
    visualizationData: json.visualization.visualize,
    receivedAt: Date.now()
  };
}

function fetchSpecVisualization(projectId, specId) {
  return dispatch => {
    dispatch(requestSpecVisualizationDispatcher());
    return fetch(`/specs/v1/specs/${ specId }/visualization?project_id=${ projectId }`)
      .then(response => response.json())
      .then(json => dispatch(receiveSpecVisualizationDispatcher(json)))
      .catch(err => console.error("Error fetching visualization: ", err));
  };
}

function shouldFetchSpecVisualization(state) {
  const { visualization } = state;
  if (visualization.specId || visualization.isFetching) {
    return false;
  }
  return true;
}

export function fetchSpecVisualizationIfNeeded(projectId, specId) {
  return (dispatch, getState) => {
    if (shouldFetchSpecVisualization(getState())) {
      return dispatch(fetchSpecVisualization(projectId, specId));
    }
  };
}

export function clearVisualization() {
  return {
    type: CLEAR_VISUALIZATION
  };
}
