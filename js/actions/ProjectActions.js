import {
  TITLE_CHANGED,
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  REQUEST_DATASETS,
  RECEIVE_DATASETS
} from '../constants/ActionTypes';

import fetch from 'isomorphic-fetch';

export function changeTitle(text) {
  return {
    type: TITLE_CHANGED,
    text
  }
}

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

function fetchProject() {
  return dispatch => {
    dispatch(requestProject());
    return fetch('//localhost:8081/api/getProjectID')
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

export function fetchProjectIfNeeded() {
  return (dispatch, getState) => {
    return dispatch(fetchProject());
  };
}

export function fetchDatasetsIfNeeded(projectID) {
  return (dispatch, getState) => {
    return dispatch(fetchDatasets(projectID));
  };
}
