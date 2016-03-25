import {
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  CREATE_PROJECT,
  CREATED_PROJECT,
  SUBMIT_PROJECT,
  REQUEST_USER_PROJECTS,
  RECEIVE_USER_PROJECTS,
  REQUEST_PRELOADED_PROJECTS,
  RECEIVE_PRELOADED_PROJECTS,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

import { fetch } from './api.js';

function requestProjectDispatcher(projectId) {
  return {
    type: REQUEST_PROJECT,
    projectId: projectId
  };
}

function receiveProjectDispatcher(json) {
  return {
    type: RECEIVE_PROJECT,
    projectProperties: json,
    receivedAt: Date.now()
  };
}

function requestPreloadedProjectsDispatcher() {
  return {
    type: REQUEST_PRELOADED_PROJECTS
  };
}

function receivePreloadedProjectsDispatcher(json) {
  return {
    type: RECEIVE_PRELOADED_PROJECTS,
    projects: json.projects,
    receivedAt: Date.now()
  };
}

function requestUserProjectsDispatcher() {
  return {
    type: REQUEST_USER_PROJECTS
  };
}

function receiveUserProjectsDispatcher(json) {
  return {
    type: RECEIVE_USER_PROJECTS,
    projects: json.projects,
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

export function wipeProjectState() {
  return {
    type: WIPE_PROJECT_STATE
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

export function createProject(user_id, title, description) {
  const params = {
    'user_id': user_id || null,
    'anonymous': user_id ? false : true,
    'title': title,
    'description': description
  }

  return dispatch => {
    dispatch(createProjectDispatcher());
    return fetch('/projects/v1/projects', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(createdProjectDispatcher(json)));
  }
}

export function fetchPreloadedProjects(user_id) {
  return dispatch => {
    dispatch(requestPreloadedProjectsDispatcher());
    return fetch(`/projects/v1/projects?preloaded=True` + (user_id ? `&user_id=${ user_id }` : ''))
      .then(response => response.json())
      .then(json => dispatch(receivePreloadedProjectsDispatcher(json)));
  };
}

export function fetchUserProjects(user_id) {
  return dispatch => {
    dispatch(requestUserProjectsDispatcher());
    return fetch(`/projects/v1/projects?private=True` + (user_id ? `&user_id=${ user_id }` : ''))
      .then(response => response.json())
      .then(json => dispatch(receiveUserProjectsDispatcher(json)));
  };
}

function fetchProject(projectId) {
  return dispatch => {
    dispatch(requestProjectDispatcher(projectId));
    return fetch('/projects/v1/projects/' + projectId)
      .then(response => response.json())
      .then(json => dispatch(receiveProjectDispatcher(json)));
  };
}

function submitProjectDispatcher(projectId) {
  return {
    type: SUBMIT_PROJECT,
    projectId: projectId
  };
}

export function submitProject(projectId, params) {
  return dispatch => {
    dispatch(submitProjectDispatcher(projectId));
    return fetch('/projects/v1/projects/' + projectId, {
      method: 'put',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
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
}
