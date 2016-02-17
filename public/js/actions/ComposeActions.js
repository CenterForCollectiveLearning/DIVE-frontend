import {
  REQUEST_EXPORTED_VISUALIZATION_SPECS,
  RECEIVE_EXPORTED_VISUALIZATION_SPECS,
  SELECT_COMPOSE_VISUALIZATION,
  SAVE_BLOCK_FORMAT,
  SAVE_BLOCK_TEXT,
  SAVE_BLOCK_HEADER,
  SAVE_VIZ_SIZE,
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
    exportedSpecId: exportedSpecId,
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
  dispatch(receiveSaveDocumentDispatcher());
}

const debouncedChangeDocument = _.debounce(undebouncedChangeDocument, 500);

function saveBlockFormatDispatcher(id, format) {
  return {
    type: SAVE_BLOCK_FORMAT,
    exportedSpecId: id,
    format: format
  };
}

function saveBlockTextDispatcher(id, text) {
  return {
    type: SAVE_BLOCK_TEXT,
    exportedSpecId: id,
    text: text,
    meta: {
      debounce: {
        time: 500
      }
    }
  };
}

function saveBlockHeaderDispatcher(id, header) {
  return {
    type: SAVE_BLOCK_HEADER,
    exportedSpecId: id,
    header: header,
    meta: {
      debounce: {
        time: 500
      }
    }
  };
}

function saveVizSizeDispatcher(id, dimensions) {
  return {
    type: SAVE_VIZ_SIZE,
    exportedSpecId: id,
    dimensions: dimensions,
    meta: {
      debounce: {
        time: 500
      }
    }
  };
}

export function saveBlockText(id, text) {
  return (dispatch, getState) => {
    dispatch(saveBlockTextDispatcher(id, text));
    debouncedChangeDocument(dispatch, getState);
  }
}

export function saveBlockHeader(id, header) {
  return (dispatch, getState) => {
    dispatch(saveBlockHeaderDispatcher(id, header));
    debouncedChangeDocument(dispatch, getState);
  }
}

export function saveBlockFormat(id, format) {
  return (dispatch, getState) => {
    dispatch(saveBlockFormatDispatcher(id, format));
    debouncedChangeDocument(dispatch, getState);
  }
}

export function saveVizSize(id, dimensions) {
  return (dispatch, getState) => {
    dispatch(saveVizSizeDispatcher(id, dimensions));
    debouncedChangeDocument(dispatch, getState);
  }
}
