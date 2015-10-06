import {
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES
} from '../constants/ActionTypes';

import fetch from './api.js'

function requestFieldPropertiesDispatcher() {
  return {
    type: REQUEST_FIELD_PROPERTIES
  };
}

function receiveFieldPropertiesDispatcher(projectId, datasetId, json) {
  return {
    type: RECEIVE_FIELD_PROPERTIES,
    projectId: projectId,
    datasetId: datasetId,
    fieldProperties: json,
    receivedAt: Date.now()
  };
}

export function fetchFieldProperties(projectId, datasetId) {
  return dispatch => {
    dispatch(requestFieldPropertiesDispatcher());
    return fetch(`/field_properties/v1/field_properties?project_id=${projectId}&dataset_id=${datasetId}&group_by=general_type`)
      .then(response => response.json())
      .then(json => dispatch(receiveFieldPropertiesDispatcher(projectId, datasetId, json)));
  };
}

function shouldFetchFieldProperties(state) {
  const fieldProperties = state.fieldProperties;
  if (fieldProperties.items.length > 0 || fieldProperties.isFetching) {
    return false;
  }
  return true;
}

export function fetchFieldPropertiesIfNeeded(projectId, datasetId) {
  return (dispatch, getState) => {
    if (shouldFetchFieldProperties(getState())) {
      return dispatch(fetchFieldProperties(projectId, datasetId));
    }
  };
}
