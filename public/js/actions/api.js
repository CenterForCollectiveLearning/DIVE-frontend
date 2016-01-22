import { default as isomorphicFetch } from 'isomorphic-fetch';

const API_URL = window.__env.API_URL

export function fetch(urlPath, options) {
  const completeUrl = API_URL + urlPath;
  return isomorphicFetch(completeUrl, options);
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

export function pollForTaskResult(taskId, dispatcherParams, dispatcher, interval=400, limit=300, counter=0) {
  const completeUrl = API_URL + `/task_result/${ taskId }`;

  return dispatch => {
    return isomorphicFetch(completeUrl, {})
      .then(response => response.json())
      .then(function(data) {
        if (data.state == 'SUCCESS') {
          dispatch(dispatcher(dispatcherParams, data.info));
        } else if (counter > limit) {
          dispatch(dispatcher(dispatcherParams, null));
        } else {
          setTimeout(function() { dispatch(pollForTaskResult(taskId, dispatcherParams, dispatcher, interval, limit, counter + 1)) }, interval);
        }
      });
  };
}
