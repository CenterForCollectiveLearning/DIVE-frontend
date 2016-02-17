import {
  REQUEST_EXPORTED_VISUALIZATION_SPECS,
  RECEIVE_EXPORTED_VISUALIZATION_SPECS,
  SELECT_DOCUMENT,
  REQUEST_DOCUMENTS,
  RECEIVE_DOCUMENTS,
  REQUEST_DOCUMENT,
  RECEIVE_DOCUMENT,
  REQUEST_CREATE_DOCUMENT,
  RECEIVE_CREATE_DOCUMENT,
  REQUEST_UPDATE_DOCUMENT,
  RECEIVE_UPDATE_DOCUMENT,
  REQUEST_DELETE_DOCUMENT,
  RECEIVE_DELETE_DOCUMENT,
  SELECT_COMPOSE_VISUALIZATION,
  SET_BLOCK_FORMAT
} from '../constants/ActionTypes';

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

export function fetchExportedVisualizationSpecs(projectId) {
  return (dispatch) => {
    dispatch(requestExportedVisualizationSpecsDispatcher());
    return fetch(`/exported_specs/v1/exported_specs?project_id=${projectId}`)
      .then(response => response.json())
      .then(function(json) {
        const dispatchParams = {};
        dispatch(receiveExportedVisualizationSpecsDispatcher(dispatchParams, json.result))
      });
  };
}

function selectDocumentDispatcher(documentId) {
  return {
    type: SELECT_DOCUMENT,
    documentId: documentId
  };
}

export function selectDocument(documentId) {
  return (dispatch) => {
    dispatch(selectDocumentDispatcher(documentId));
  }
}

function requestDocumentsDispatcher(projectId) {
  return {
    type: REQUEST_DOCUMENTS,
    projectId: projectId
  };
}

function receiveDocumentsDispatcher(projectId, json) {
  return {
    type: RECEIVE_DOCUMENTS,
    projectId: projectId,
    documents: json.documents,
    receivedAt: Date.now(),
  };
}

export function fetchExportedVisualizationSpecsIfNeeded(projectId) {
  return (dispatch, getState) => {
    if (shouldFetchExportedVisualizationSpecs(getState())) {
      return dispatch(fetchExportedVisualizationSpecs(projectId));
    }
  };
}

export function fetchDocuments(projectId) {
  return (dispatch) => {
    dispatch(requestDocumentsDispatcher(projectId));
    return fetch(`/compose/v1/documents?project_id=${projectId}`)
      .then(response => response.json())
      .then(function(json) {
        const dispatchParams = {};
        dispatch(receiveDocumentsDispatcher(dispatchParams, json))
      });
  };
}

function requestDocumentDispatcher(projectId, documentId) {
  return {
    type: REQUEST_DOCUMENT,
    projectId: projectId,
    documentId: documentId
  };
}

function receiveDocumentDispatcher(projectId, documentId, json) {
  return {
    type: RECEIVE_DOCUMENT,
    projectId: projectId,
    'document': json,
    receivedAt: Date.now(),
  };
}

export function requestDocument(projectId, documentId) {
  return (dispatch) => {
    dispatch(requestDocumentDispatcher(projectId, documentId));
    return fetch(`/compose/v1/document/${documentId}?project_id=${projectId}`)
      .then(response => response.json())
      .then(json => dispatch(receiveDocumentDispatcher(projectId, documentId, json)))
  }
}

function requestCreateDocumentDispatcher(projectId) {
  return {
    type: REQUEST_CREATE_DOCUMENT,
    projectId: projectId
  };
}

function receiveCreateDocumentDispatcher(projectId, json) {
  return {
    type: RECEIVE_CREATE_DOCUMENT,
    projectId: projectId,
    'document': json,
    receivedAt: Date.now()
  };
}

export function createNewDocument(projectId, content={}) {
  const params = {
    project_id: projectId,
    title: 'New Document',
    content: content
  }
  return (dispatch) => {
    dispatch(requestCreateDocumentDispatcher(projectId));
    return fetch('/compose/v1/document', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveCreateDocumentDispatcher(projectId, json)))
  }
}

function requestUpdateDocumentDispatcher(projectId, documentId) {
  return {
    type: REQUEST_UPDATE_DOCUMENT,
    projectId: projectId,
    documentId: documentId
  };
}

function receiveUpdateDocumentDispatcher(projectId, documentId) {
  return {
    type: REQUEST_UPDATE_DOCUMENT,
    projectId: projectId,
    datasetId: datasetId
  };
}

export function updateDocument(projectId, documentId, content) {
  const params = {
    project_id: projectId,
    content: content
  }
  return (dispatch) => {
    dispatch(requestUpdateDocumentDispatcher(projectId, documentId));
    return fetch(`/compose/v1/document/${documentId}`, {
      method: 'put',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveUpdateDocumentDispatcher(projectId, json)))
  }
}

function requestDeleteDocumentDispatcher(projectId, documentId) {
  return {
    type: REQUEST_DELETE_DOCUMENT,
    projectId: projectId,
    documentId: documentId
  };
}

function receiveDeleteDocumentDispatcher(projectId, json) {
  return {
    type: RECEIVE_DELETE_DOCUMENT,
    projectId: projectId,
    documentid: json.id
  };
}

export function deleteDocument(projectId, documentId) {
  return (dispatch) => {
    dispatch(requestDeleteDocumentDispatcher(projectId, documentId));
    return fetch(`/compose/v1/document/${documentId}?project_id=${projectId}`, {
      method: 'delete'
    }).then(response => response.json())
      .then(json => dispatch(receiveDeleteDocumentDispatcher(projectId, json)))
  }
}
