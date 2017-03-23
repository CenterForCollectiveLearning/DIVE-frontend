import { default as isomorphicFetch } from 'isomorphic-fetch';
import { REQUEST_ONE_D_AGGREGATION, REQUEST_AGGREGATION } from '../constants/ActionTypes';

import TaskManager from './TaskManager';
const taskManager = new TaskManager();

const API_URL = window.__env.API_URL;
const DEBUG = (window.__env.NODE_ENV == "DEVELOPMENT");

function checkStatus(response) {
  const status = response.status;
  if (status >= 200 && status < 300) {
    return response
  } else {
    const statusText = response.statusText;
    var error = new Error(statusText);
    error.statusText = statusText;
    error.status = status;
    error.response = response;

    if (window.__env.NODE_ENV != "DEVELOPMENT") {
      Raven.captureException(error);
    }
    throw error;
  }
}

function parseJSON(response) {
  return response.json()
}

export function rawFetch(urlPath, options) {
  const completeUrl = API_URL + urlPath;
  return isomorphicFetch(completeUrl, { ...options, credentials: 'include' });
}

export function fetch(urlPath, options) {
  return rawFetch(urlPath, options)
    .then(checkStatus)
    .then(parseJSON);
}

export function httpRequest(method, urlPath, formData, completeEvent, uploadEvents) {
  const completeUrl = API_URL + urlPath;
  var request = new XMLHttpRequest();
  request.onload = completeEvent(request);

  uploadEvents.forEach((event) =>
    request.upload.addEventListener(event.type, event.function, false)
  );

  request.open(method, completeUrl, true);
  request.send(formData);
}

function revokeTasks(taskIds) {
  const completeUrl = API_URL + '/tasks/v1/revoke';

  if (!Array.isArray(taskIds)) {
    taskIds = [ taskIds ];
  }

  var options = {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ 'task_ids': taskIds })
  };

  taskManager.removeTasks(taskIds);
  return isomorphicFetch(completeUrl, options).then(response => response.json());
}

function initializeTask(taskId, taskMode, taskType) {
  const tasksToRevokeObject = taskManager.addTask(taskId, taskMode, taskType);

  const tasksOfDifferentMode = tasksToRevokeObject.differentMode;
  const tasksOfSameType = tasksToRevokeObject.sameType;
  const tasksToRevoke = tasksOfDifferentMode + tasksOfSameType;

  console.group(`Initializing task ${ taskId } of type ${ taskType }`)
  console.debug('Tasks of different mode:', tasksOfDifferentMode);
  console.debug('Tasks of same type:', tasksOfSameType);
  console.groupEnd();

  if (tasksToRevoke.length) {
    revokeTasks(tasksToRevoke);
  }
}

export function pollForTask(taskId, taskMode, taskType, dispatcherParams, dispatchers, interval=1000, limit=50, counter=0) {
  const successDispatcher = dispatchers.success;
  const progressDispatcher = dispatchers.progress;
  const errorDispatcher = dispatchers.error;

  const aggregationActionTypes = [ REQUEST_ONE_D_AGGREGATION, REQUEST_AGGREGATION ];
  taskType = (aggregationActionTypes.indexOf( taskType ) > -1) ? REQUEST_AGGREGATION : taskType;

  const completeUrl = API_URL + `/tasks/v1/result/${ taskId }`;
  const firstIteration = (counter == 0);

  if (firstIteration) {
    initializeTask(taskId, taskMode, taskType);
  } else {
    taskManager.updateTask(taskId);
  }

  if (DEBUG) {
    taskManager.outputStateAsTable();
  }

  return dispatch => {
    return isomorphicFetch(completeUrl, {})
      .then(response => response.json())
      .then(function(data) {
        if (!taskManager.isActiveTask(taskId)) {
          console.debug(`Received ${ data.state } but task ${ taskId } of type ${ taskType } is no longer active`);
          return;
        }
        if (data.state == 'SUCCESS') {
          console.debug(`[SUCCESS] Task ${ taskId } of type ${ taskType } success.`)
          taskManager.removeTask(taskId);
          dispatch(successDispatcher(dispatcherParams, data.result));
        } else if (data.state == 'FAILURE') {
          console.debug(`[FAILURE] Task ${ taskId } of type ${ taskType } failed.`);

          taskManager.removeTask(taskId);
          Raven.captureException(new Error('Failed polling request'));
          dispatch(errorDispatcher(data));
        } else if (data.state == 'REVOKED') {
          console.debug(`[REVOKE] Task ${ taskId } of type ${ taskType } revoked.`);

          taskManager.removeTask(taskId);
          Raven.captureException(new Error('Revoked polling request'));
          dispatch(errorDispatcher(data));
        } else if (counter > limit) {
          console.debug(`[TIME OUT] Task ${ taskId } of type ${ taskType } exceeded polling limit.`);

          revokeTasks([ taskId ]).then((revokeData) => {
            dispatch(errorDispatcher({ ...data.result, error: `Polling timed out for task ${ taskId } of type ${ taskType }` }));
          });
        } else {
          if (progressDispatcher && data.hasOwnProperty('currentTask')) {
            dispatch(progressDispatcher(data));
            setTimeout(() => dispatch(pollForTask(taskId, taskMode, taskType, dispatcherParams, dispatchers, interval, limit, counter + 1)), interval);
          }
        }
      });
  };
}
