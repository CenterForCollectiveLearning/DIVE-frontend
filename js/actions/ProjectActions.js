import {
  REQUEST_PROJECT,
  RECEIVE_PROJECT
} from '../constants/ActionTypes';

import fetch from './api.js';

function requestProjectDispatcher() {
  return {
    type: REQUEST_PROJECT
  };
}

function receiveProjectDispatcher(json) {
  return {
    type: RECEIVE_PROJECT,
    projectProperties: json,
    receivedAt: Date.now()
  };
}

function fetchProject(projectTitle) {
  return dispatch => {
    dispatch(requestProjectDispatcher());
    return fetch('/getProjectID?formattedProjectTitle=' + projectTitle)
      .then(response => response.json())
      .then(json => dispatch(receiveProjectDispatcher(json)));
  };
}

function shouldFetchProject(state) {
  const project = state.project;
  if (project.properties.id || project.isFetching) {
    return false;
  }
  return true;
}

export function fetchProjectIfNeeded(projectId) {
  return {
    type: RECEIVE_PROJECT, 
    projectProperties: {
      id: projectId
    }
  };
  // return (dispatch, getState) => {
  //   if (shouldFetchProject(getState())) {
  //     return dispatch(fetchProject(projectTitle));
  //   }
  // };
}
