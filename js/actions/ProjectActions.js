import {
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  CREATE_PROJECT,
  CREATED_PROJECT
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

function createProjectDispatcher() {
  return {
    type: CREATE_PROJECT,
  };
}

function createdProjectDispatcher(json) {
  return {
    type: CREATED_PROJECT,
    projectProperties: json,
    receivedAt: Date.now()
  };
}

function shouldCreateProject(state) {
  const { project } = state;
  if (project.loaded && !(project.properties || project.isFetching)) {
    return true;
  }
  return false;
}

export function createProjectIfNeeded(user_id, title, description) {
  return (dispatch, getState) => {
    if (shouldCreateProject(getState())) {
      return dispatch(createProject(user_id, title, description));
    }
  }
}

function createProject(user_id, title, description) {
  var formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('title', title);
  formData.append('description', description);

  return dispatch => {
    dispatch(createProjectDispatcher());
    return fetch('/projects/v1/projects', {
      method: 'post',
      body: formData
    }).then(response => response.json())
      .then(json => dispatch(createdProjectDispatcher(json)));
  }
}

function fetchProject(projectId) {
  return dispatch => {
    dispatch(requestProjectDispatcher());
    return fetch('/projects/v1/projects/' + projectId)
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
  return (dispatch, getState) => {
    if (shouldFetchProject(getState())) {
      return dispatch(fetchProject(projectId));
    }
  }
  // return {
  //   type: RECEIVE_PROJECT,
  //   projectProperties: {
  //     id: projectId
  //   }
  // };
  // return (dispatch, getState) => {
  //   if (shouldFetchProject(getState())) {
  //     return dispatch(fetchProject(projectId));
  //   }
  // };
}
