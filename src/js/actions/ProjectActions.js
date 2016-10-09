import {
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  CREATE_PROJECT,
  CREATED_PROJECT,
  UPDATE_PROJECT,
  UPDATED_PROJECT,
  REQUEST_USER_PROJECTS,
  RECEIVE_USER_PROJECTS,
  REQUEST_PRELOADED_PROJECTS,
  RECEIVE_PRELOADED_PROJECTS,
  DELETE_PROJECT,
  DELETED_PROJECT,
  REQUEST_SEND_FEEDBACK,
  RECEIVE_SEND_FEEDBACK,
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
  if (project.loaded && !(project || project.isFetching)) {
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
    }).then(json => dispatch(createdProjectDispatcher(json)));
  }
}

function deleteProjectDispatcher(projectId) {
  return {
    type: DELETE_PROJECT,
    projectId: projectId
  };
}

function deletedProjectDispatcher(projectId) {
  return {
    type: DELETED_PROJECT,
    projectId: projectId.id
  };
}

function goHome() {
  window.location.href = '/';
}

export function deleteProjectNoReturnHome(projectId) {
  return dispatch => {
    dispatch(deleteProjectDispatcher(projectId));
    return fetch(`/projects/v1/projects/${ projectId }`, {
      method: 'delete'
    }).then(json => dispatch(deletedProjectDispatcher(json)))
  }
}

export function deleteProject(projectId) {
  return dispatch => {
    dispatch(deleteProjectDispatcher(projectId));
    return fetch(`/projects/v1/projects/${ projectId }`, {
      method: 'delete'
    }).then(json => dispatch(deletedProjectDispatcher(json)))
      .then(goHome);
  }
}

export function fetchPreloadedProjects(userId) {
  return dispatch => {
    dispatch(requestPreloadedProjectsDispatcher());
    return fetch(`/projects/v1/projects?preloaded=True` + (userId ? `&user_id=${ userId }` : ''))
      .then(json => dispatch(receivePreloadedProjectsDispatcher(json)));
  };
}

export function fetchUserProjects(userId) {
  return dispatch => {
    dispatch(requestUserProjectsDispatcher());
    return fetch(`/projects/v1/projects?private=True` + (userId ? `&user_id=${ userId }` : ''))
      .then(json => dispatch(receiveUserProjectsDispatcher(json)));
  };
}

function fetchProject(projectId) {
  return dispatch => {
    dispatch(requestProjectDispatcher(projectId));
    return fetch('/projects/v1/projects/' + projectId)
      .then(json => dispatch(receiveProjectDispatcher(json)));
  };
}

function updateProjectDispatcher(projectId) {
  return {
    type: UPDATE_PROJECT,
    projectId: projectId
  };
}

function updatedProjectDispatcher(json) {
  return {
    type: UPDATED_PROJECT,
    projectProperties: json,
    receivedAt: Date.now()
  };
}

export function updateProject(projectId, params) {
  return dispatch => {
    dispatch(updateProjectDispatcher(projectId));
    return fetch('/projects/v1/projects/' + projectId, {
      method: 'put',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(json => dispatch(updatedProjectDispatcher(json)));
  };
}

function shouldFetchProject(state) {
  const project = state.project;
  if (project.id || project.isFetching) {
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

// Feedback
function requestSendFeedbackDispatcher(projectId, feedbackType, description) {
  return {
    type: REQUEST_SEND_FEEDBACK,
    projectId: projectId,
    feedbackType: feedbackType,
    description: description
  };
}

function receiveSendFeedbackDispatcher(json) {
  return {
    type: RECEIVE_SEND_FEEDBACK,
    feedbackId: json.feedbackId,
    message: json.message,
    receivedAt: Date.now()
  };
}

export function submitFeedback(projectId, userId, userEmail, username, feedbackType, description) {
  const params = {
    project_id: projectId,
    user_id: userId,
    user_email: userEmail,
    username: username,
    feedback_type: feedbackType,
    description: description
  };

  return (dispatch) => {
    dispatch(requestSendFeedbackDispatcher(projectId, feedbackType, description));
    return fetch('/feedback/v1/feedback', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveSendFeedbackDispatcher(json)))
      .catch(err => console.error("Error submitting feedback: ", err));
  }
}
