import { default as isomorphicFetch } from 'isomorphic-fetch';

const API_URL = window.__env.API_URL

export function fetch(urlPath, options) {
  const completeUrl = API_URL + urlPath;
  return isomorphicFetch(completeUrl, options);
}

// Short polling for task result given task ID
export function pollForTaskResult(taskId, dispatcherParams, dispatcher, interval=200, limit=30000) {
  const completeUrl = API_URL + `/task_result/${ taskId }`;

  // There must be a better way than basically passing a callback...
  console.log("Polling for task result", taskId)
  return dispatch => {
    return isomorphicFetch(completeUrl, {})
      .then(response => response.json())
      .then(function(data) {
        if (data.state == 'SUCCESS') {
          dispatch(dispatcher(dispatcherParams, data.info))
        }
        else {
          setTimeout(function() { dispatch(pollForTaskResult(taskId, dispatcherParams, dispatcher)) }, interval)
        }
      });
  };
}
