import {
  REQUEST_SPECS,
  RECEIVE_SPECS,
  FAILED_RECEIVE_SPECS,
  SELECT_VISUALIZATION_TYPE,
  SELECT_BUILDER_VISUALIZATION_TYPE,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA,
  CLEAR_VISUALIZATION,
  REQUEST_CREATE_EXPORTED_SPEC,
  RECEIVE_CREATED_EXPORTED_SPEC,
  SET_SHARE_WINDOW
} from '../constants/ActionTypes';

import { fetch, pollForTaskResult } from './api.js';
import { formatTableData } from './ActionHelpers.js'

function requestSpecsDispatcher() {
  return {
    type: REQUEST_SPECS
  };
}

function receiveSpecsDispatcher(params, json) {
  if (json) {
    return {
      ...params,
      type: RECEIVE_SPECS,
      specs: json,
      receivedAt: Date.now()
    };
  }

  return {
    ...params,
    type: FAILED_RECEIVE_SPECS,
    specs: [],
    receivedAt: Date.now()
  };
}

function fetchSpecs(projectId, datasetId, fieldProperties, fieldPropertyValues) {

  const cPropertyValuePairs = !fieldPropertyValues.length ? [] : fieldPropertyValues.filter((fieldPropertyValuePair) => (fieldPropertyValuePair.type == 'c') && fieldProperties.indexOf(fieldPropertyValuePair.fieldId) >= 0);
  const qPropertyValuePairs = !fieldPropertyValues.length ? [] : fieldPropertyValues.filter((fieldPropertyValuePair) => (fieldPropertyValuePair.type == 'q') && fieldProperties.indexOf(fieldPropertyValuePair.fieldId) >= 0);

  const conditionals = !cPropertyValuePairs.length ? {} : {
    'and': cPropertyValuePairs.map((fieldPropertyValuePair) =>
        new Object({
          'field_id': fieldPropertyValuePair.fieldId,
          'operation': '==',
          'criteria': fieldPropertyValuePair.valueId
        })
      )
  };

  const formatFieldAggPairs = function (fieldProperty) {
    var fieldAggPairs = {
      'field_id': fieldProperty
    };

    const qPropertyValuePair = qPropertyValuePairs.find((propertyValuePair) => propertyValuePair.fieldId == fieldProperty);

    if (qPropertyValuePair) {
      fieldAggPairs['agg_fn'] = qPropertyValuePair.valueId;
    }

    return fieldAggPairs;
  };

  const params = {
    'project_id': projectId,
    'dataset_id': datasetId,
    'field_agg_pairs': (!fieldProperties || !fieldProperties.length) ? null : fieldProperties.map(formatFieldAggPairs),
    'conditionals': conditionals
  };

  return dispatch => {
    dispatch(requestSpecsDispatcher());

    return fetch(`/specs/v1/specs`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(function(json) {
        const dispatchParams = { project_id: projectId, dataset_id: datasetId };
        // TODO Do this more consistently with status flags
        // console.log(json, (json.specs.length > 0))
        if (json.taskId) {
          dispatch(pollForTaskResult(json.taskId, dispatchParams, receiveSpecsDispatcher));
        }
        else if (json.specs.length > 0) {
          dispatch(receiveSpecsDispatcher(dispatchParams, json.specs));
        }
      })

  };
}

function shouldFetchSpecs(state) {
  const { specs } = state;
  if (specs.isFetching) {
    return false;
  }
  return true;
}

export function fetchSpecsIfNeeded(projectId, datasetId, fieldProperties=[], fieldPropertyValues=[]) {
  return (dispatch, getState) => {
    if (shouldFetchSpecs(getState())) {
      return dispatch(fetchSpecs(projectId, datasetId, fieldProperties, fieldPropertyValues));
    }
  };
}

export function selectVisualizationType(selectedType) {
  return {
    type: SELECT_VISUALIZATION_TYPE,
    selectedType: selectedType
  }
}

export function selectBuilderVisualizationType(selectedType) {
  return {
    type: SELECT_BUILDER_VISUALIZATION_TYPE,
    selectedType: selectedType
  }
}

function requestSpecVisualizationDispatcher() {
  return {
    type: REQUEST_VISUALIZATION_DATA
  };
}

function receiveSpecVisualizationDispatcher(json) {
  return {
    type: RECEIVE_VISUALIZATION_DATA,
    spec: json.spec,
    tableData: formatTableData(json.visualization.table.columns, json.visualization.table.data),
    visualizationData: json.visualization.visualize,
    receivedAt: Date.now()
  };
}

function fetchSpecVisualization(projectId, specId) {
  return dispatch => {
    dispatch(requestSpecVisualizationDispatcher());
    return fetch(`/specs/v1/specs/${ specId }/visualization?project_id=${ projectId }`)
      .then(response => response.json())
      .then(json => dispatch(receiveSpecVisualizationDispatcher(json)))
      .catch(err => console.error("Error fetching visualization: ", err));
  };
}

function shouldFetchSpecVisualization(state) {  
  const { visualization } = state;
  if (visualization.specId || visualization.isFetching) {
    return false;
  }
  return true;
}

export function fetchSpecVisualizationIfNeeded(projectId, specId) {
  return (dispatch, getState) => {
    if (shouldFetchSpecVisualization(getState())) {
      return dispatch(fetchSpecVisualization(projectId, specId));
    }
  };
}

export function clearVisualization() {
  return {
    type: CLEAR_VISUALIZATION
  };  
}

function requestCreateExportedSpecDispatcher() {
  return {
    type: REQUEST_CREATE_EXPORTED_SPEC
  };
}

function receiveCreatedExportedSpecDispatcher(json) {
  return {
    type: RECEIVE_CREATED_EXPORTED_SPEC,
    exportedSpecId: json.id,
    specId: json.specId,
    receivedAt: Date.now()
  };
}

export function createExportedSpec(projectId, specId, conditionals, config) {
  const params = {
    project_id: projectId,
    spec_id: specId,
    conditionals: conditionals,
    config: config
  }

  return dispatch => {
    dispatch(requestCreateExportedSpecDispatcher());
    return fetch('/exported_specs/v1/exported_specs', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }      
    }).then(response => response.json())
      .then(json => dispatch(receiveCreatedExportedSpecDispatcher(json)))
      .catch(err => console.error("Error creating exported spec: ", err));
  };
}

export function setShareWindow(shareWindow) {
  return {
    type: SET_SHARE_WINDOW,
    shareWindow: shareWindow
  }
}
