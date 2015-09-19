import {
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  REQUEST_DATASETS,
  RECEIVE_DATASETS
} from '../constants/ActionTypes';

import fetch from 'isomorphic-fetch';

function requestProject() {
  return {
    type: REQUEST_PROJECT
  };
}

function receiveProject(json) {
  return {
    type: RECEIVE_PROJECT,
    projectProperties: json,
    receivedAt: Date.now()
  };
}

function requestDatasets() {
  return {
    type: REQUEST_DATASETS
  };
}

function receiveDatasets(projectID, json) {
  return {
    type: RECEIVE_DATASETS,
    projectID: projectID,
    datasets: json.datasets,
    receivedAt: Date.now()
  };
}

function fetchProject(projectTitle) {
  return dispatch => {
    dispatch(requestProject());
    return fetch('//localhost:8081/api/getProjectID?formattedProjectTitle=' + projectTitle)
      .then(response => response.json())
      .then(json => dispatch(receiveProject(json)));
  };
}

function fetchDatasets(projectID) {
  return dispatch => {
    dispatch(requestDatasets(projectID));
    return fetch('//localhost:8081/api/datasets?pID=' + projectID)
      .then(response => response.json())
      .then(json => dispatch(receiveDatasets(projectID, json)));
  };
}

function shouldFetchProject(state) {
  const project = state.project;
  if (project.properties.id || project.isFetching) {
    return false;
  }
  return true;
}

function shouldFetchDatasets(state) {
  const datasets = state.datasets;
  if (datasets.items.length > 0 || datasets.isFetching) {
    return false;
  }
  return true;
}

export function fetchProjectIfNeeded(projectTitle) {
  return (dispatch, getState) => {
    if (shouldFetchProject(getState())) {
      return dispatch(fetchProject(projectTitle));
    }
  };
}

export function fetchDatasetsIfNeeded(projectID) {
  return (dispatch, getState) => {
    if (shouldFetchDatasets(getState())) {
      return dispatch(fetchDatasets(projectID));
    }
  };
}
