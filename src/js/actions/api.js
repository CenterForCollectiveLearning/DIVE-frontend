import { default as isomorphicFetch } from 'isomorphic-fetch';
import { REQUEST_ONE_D_AGGREGATION, REQUEST_AGGREGATION } from '../constants/ActionTypes';


import TaskManager from './TaskManager';

const API_URL = window.__env.API_URL;

const taskManager = new TaskManager();

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const statusText = response.statusText;
    var error = new Error(statusText)
    if (window.__env.NODE_ENV != "DEVELOPMENT") {
      Raven.captureException(error);
      error.response = response
    }
    throw error
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

  console.log('Revoking tasks', taskIds);

  var options = {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ 'task_ids': taskIds })
  };

  taskManager.removeTasks(taskIds);
  return isomorphicFetch(completeUrl, options).then(response => response.json());
}

export function pollForTask(taskId, taskType, dispatcherParams, dispatcher, progressDispatcher, errorDispatcher, interval=1000, limit=50, counter=0) {
  const aggregationActionTypes = [ REQUEST_ONE_D_AGGREGATION, REQUEST_AGGREGATION ];

  if (aggregationActionTypes.indexOf( taskType ) > -1) {
    taskType = REQUEST_AGGREGATION
  }
  const otherTaskIdsOfSameType = taskManager.addTask(taskId, taskType);
  if (otherTaskIdsOfSameType.length) {
    revokeTasks(otherTaskIdsOfSameType);
  }

  const completeUrl = API_URL + `/tasks/v1/result/${ taskId }`;

  return dispatch => {
    return isomorphicFetch(completeUrl, {})
      .then(response => response.json())
      .then(function(data) {
        if (data.state == 'SUCCESS') {
          taskManager.removeTask(taskId);
          dispatch(dispatcher(dispatcherParams, data.result));
        } else if (data.state == 'FAILURE') {
          console.log(`Task ${ taskId } of type ${ taskType } failed.`);
          taskManager.removeTask(taskId);
          Raven.captureException(new Error('Failed polling request'));
          dispatch(errorDispatcher(data));
        } else if (data.state == 'REVOKED') {
          console.log(`Task ${ taskId } of type ${ taskType } revoked.`);
          taskManager.removeTask(taskId);
          Raven.captureException(new Error('Revoked polling request'));
          dispatch(errorDispatcher(data));
        } else if (counter > limit) {
          revokeTasks(taskId).then((revokeData) => {
            dispatch(dispatcher(dispatcherParams, { ...data.result, error: `Polling timed out for task ${ taskId } of type ${ taskType }` }));
          });
        } else {
          if (progressDispatcher && data.hasOwnProperty('currentTask')) {
            dispatch(progressDispatcher(data));
          }
          if (taskManager.getTasksByID(taskId)) {
            setTimeout(() => dispatch(pollForTask(taskId, taskType, dispatcherParams, dispatcher, progressDispatcher, errorDispatcher, interval, limit, counter + 1)), interval);
          } else {
            console.log('Not polling because taskId not in taskManager:', taskId, taskManager.getAllTasks());
            taskManager.removeTask(taskId);
          }
        }
      });
  };
}
