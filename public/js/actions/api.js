import { default as isomorphicFetch } from 'isomorphic-fetch';

const API_URL = window.__env.API_URL

export function fetch(urlPath, options) {
  const completeUrl = API_URL + urlPath;
  return isomorphicFetch(completeUrl, options);
}

export function pollForChainTaskResult(taskIds, dispatcherParams, dispatcher, interval=400, limit=300, counter=0) {
  const completeUrl = API_URL + '/tasks/v1/result';

  const params = {
    'task_ids': taskIds
  }
  return dispatch => {
    return isomorphicFetch(completeUrl, {
        method: 'post',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(function(data) {
        console.log(data)
        if (data.state == 'SUCCESS') {
          dispatch(dispatcher(dispatcherParams, data.result));
        } else {
          setTimeout(function() { dispatch(pollForChainTaskResult(taskIds, dispatcherParams, dispatcher, interval, limit, counter + 1)) }, interval);
        }
      });
  };


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

export function pollForTaskResult(taskId, dispatcherParams, dispatcher, interval=400, limit=300, counter=0) {
  const completeUrl = API_URL + `/tasks/v1/result/${ taskId }`;

  return dispatch => {
    return isomorphicFetch(completeUrl, {})
      .then(response => response.json())
      .then(function(data) {
        if (data.state == 'SUCCESS') {
          dispatch(dispatcher(dispatcherParams, data.result));
        } else {
          setTimeout(function() { dispatch(pollForTaskResult(taskId, dispatcherParams, dispatcher, interval, limit, counter + 1)) }, interval);
        }
      });
  };
}
