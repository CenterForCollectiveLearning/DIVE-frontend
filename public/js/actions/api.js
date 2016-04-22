import { default as isomorphicFetch } from 'isomorphic-fetch';

import TaskManager from './TaskManager';

const API_URL = window.__env.API_URL;

const taskManager = new TaskManager();

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const statusText = response.statusText;
    var error = new Error(statusText)
    Raven.captureException(error);
    error.response = response
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

  var options = {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ 'task_ids': taskIds })
  };

  taskManager.removeTasks(taskIds);

  return isomorphicFetch(completeUrl, options).then(response => response.json());
}

export function pollForTask(taskId, taskType, dispatcherParams, dispatcher, progressDispatcher, errorDispatcher, interval=400, limit=300, counter=0) {
  const otherTasks = taskManager.addTask(taskId, taskType);
  if (otherTasks.length) {
    revokeTasks(otherTasks);
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
          taskManager.removeTask(taskId);
          console.error(data.error);
          Raven.captureException(new Error(data.error));
          dispatch(errorDispatcher(data));
        } else if (counter > limit) {
          revokeTasks(taskId).then((revokeData) => {
            dispatch(dispatcher(dispatcherParams, { ...data.result, error: 'Took too long to get visualizations.' }));
          });
        } else {
          if (progressDispatcher && data.currentTask) {
            dispatch(progressDispatcher(data));
          }
          if (taskManager.getTasks(taskId).length > 0) {
            setTimeout(function() { dispatch(pollForTask(taskId, taskType, dispatcherParams, dispatcher, progressDispatcher, errorDispatcher, interval, limit, counter + 1)) }, interval);
          }
        }
      });
  };
}
