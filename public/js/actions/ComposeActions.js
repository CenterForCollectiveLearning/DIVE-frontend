import {
  REQUEST_EXPORTED_VISUALIZATION_SPECS,
  RECEIVE_EXPORTED_VISUALIZATION_SPECS
} from '../constants/ActionTypes';

export function requestExportedVisualizationSpecsDispatcher() {
  return {
    type: REQUEST_EXPORTED_VISUALIZATION_SPECS
  };
}

export function receiveExportedVisualizationSpecsDispatcher(params, json) {
  return {
    type: RECEIVE_EXPORTED_VISUALIZATION_SPECS,
    specs: json,
    receivedAt: Date.now()
  };
}

function shouldFetchExportedVisualizationSpecs(state) {
  const exportedVisualizationSpecs = state.exportedVisualizationSpecs;
  if (exportedVisualizationSpecs.isFetching) {
    return false;
  }
  return true;
}

export function fetchExportedVisualizationSpecs(projectId) {
  return dispatch => {
    dispatch(requestExportedVisualizationSpecsDispatcher());
    return fetch('/exported_specs/v1/exported_specs', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveExportedVisualizationSpecsDispatcher(json)));
  };
}

export function fetchExportedVisualizationSpecsIfNeeded(projectId) {
  return (dispatch, getState) => {
    if (shouldFetchExported(getState())) {
      return dispatch(fetchExportedVisualizationSpecs(projectId));
    }
  };
}
