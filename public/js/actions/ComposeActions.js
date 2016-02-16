import {
  REQUEST_EXPORTED_VISUALIZATION_SPECS,
  RECEIVE_EXPORTED_VISUALIZATION_SPECS,
  SELECT_COMPOSE_VISUALIZATION,
  SET_BLOCK_FORMAT,
  SAVE_BLOCK_TEXT,
  SAVE_BLOCK_HEADER,
  REQUEST_SAVE_DOCUMENT,
  RECEIVE_SAVE_DOCUMENT,
} from '../constants/ActionTypes';

import _ from 'underscore'

import { fetch, pollForTask } from './api.js';

export function selectComposeVisualization(exportedSpecId, exportedSpecHeading) {
  return {
    type: SELECT_COMPOSE_VISUALIZATION,
    exportedSpecId: exportedSpecId,
    heading: exportedSpecHeading
  }
}

export function setVisualizationFormat(exportedSpecId, format) {
  return {
    type: SET_BLOCK_FORMAT,
    id: exportedSpecId,
    format: format
  }
}

function requestExportedVisualizationSpecsDispatcher() {
  return {
    type: REQUEST_EXPORTED_VISUALIZATION_SPECS
  };
}

function receiveExportedVisualizationSpecsDispatcher(params, json) {
  if (json && !json.error) {
    return {
      ...params,
      type: RECEIVE_EXPORTED_VISUALIZATION_SPECS,
      specs: json,
      receivedAt: Date.now()
    };
  }
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
    return fetch(`/exported_specs/v1/exported_specs?project_id=${projectId}`)
      .then(response => response.json())
      .then(function(json) {
        const dispatchParams = {};
        dispatch(receiveExportedVisualizationSpecsDispatcher(dispatchParams, json.result))
      });
  };
}

export function fetchExportedVisualizationSpecsIfNeeded(projectId) {
  return (dispatch, getState) => {
    if (shouldFetchExportedVisualizationSpecs(getState())) {
      return dispatch(fetchExportedVisualizationSpecs(projectId));
    }
  };
}

function requestSaveDocumentDispatcher() {
  return {
    type: REQUEST_SAVE_DOCUMENT
  };
}

function receiveSaveDocumentDispatcher() {
  return {
    type: RECEIVE_SAVE_DOCUMENT
  };
}

function undebouncedChangeDocument(dispatch, getState) {
  dispatch(requestSaveDocumentDispatcher());
  console.log(getState().composeSelector.blocks);
}

const debouncedChangeDocument = _.debounce(undebouncedChangeDocument, 250);

export function changeDocument() {
  return debouncedChangeDocument;
}

function saveBlockTextDispatcher() {
  return {
    type: SAVE_BLOCK_TEXT
  };
}

function saveBlockHeaderDispatcher() {
  return {
    type: SAVE_BLOCK_HEADER
  };
}

export function saveBlockText(id, text) {
  console.log('in saveBlockText');
  return dispatch => {
    dispatch(saveBlockTextDispatcher());
  }
}

export function saveBlockHeader(id, header) {
  console.log('in saveBlockHeader');
  return dispatch => {
    dispatch(saveBlockHeaderDispatcher());
  }
}
