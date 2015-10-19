import {
  REQUEST_EXPORTED_SPEC,
  RECEIVE_EXPORTED_SPEC
} from '../constants/ActionTypes';

import { fetch, pollForTaskResult } from './api.js';
import { formatTableData } from './ActionHelpers.js'

function requestExportedSpecDispatcher() {
  return {
    type: REQUEST_EXPORTED_SPEC
  };
}

function receiveExportedSpecDispatcher(json) {
  return {
    type: RECEIVE_EXPORTED_SPEC,
    spec: json.spec,
    // tableData: formatTableData(json.visualization.table.columns, json.visualization.table.data),
    tableData: [],
    visualizationData: json.visualization.visualize,
    receivedAt: Date.now()
  };
}

function fetchExportedSpec(projectId, exportedSpecId) {
  return dispatch => {
    dispatch(requestExportedSpecDispatcher());
    return fetch(`/exported_specs/v1/exported_specs/${ exportedSpecId }/visualization?project_id=${ projectId }`)
      .then(response => response.json())
      .then(json => dispatch(receiveExportedSpecDispatcher(json)))
      .catch(err => console.error("Error fetching visualization: ", err));
  };
}

function shouldFetchExportedSpec(state) {  
  const { exportedSpec } = state;
  if (exportedSpec.spec.id || exportedSpec.isFetching) {
    return false;
  }
  return true;
}

export function fetchExportedSpecIfNeeded(projectId, exportedSpecId) {
  return (dispatch, getState) => {
    if (shouldFetchExportedSpec(getState())) {
      return dispatch(fetchExportedSpec(projectId, exportedSpecId));
    }
  };
}
