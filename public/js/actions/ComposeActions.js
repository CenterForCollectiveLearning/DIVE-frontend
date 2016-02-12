import {
  REQUEST_EXPORTED_VISUALIZATION_SPECS,
  RECEIVE_EXPORTED_VISUALIZATION_SPECS,
  REQUEST_DOCUMENT,
  RECEIVE_DOCUMENT,
  REQUEST_CREATE_DOCUMENT,
  RECEIVE_CREATE_DOCUMENT,
  REQUEST_UPDATE_DOCUMENT,
  RECEIVE_UPDATE_DOCUMENT,
  REQUEST_DELETE_DOCUMENT,
  RECEIVE_DELETE_DOCUMENT
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';

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
    datasetId: datasetId,
    'document': json.document,
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
    documentId: json.id,
    receivedAt: Date.now()
  };
}

export function createNewDocument(projectId, content={}) {
  const params = {
    project_id: projectId,
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
    type: REQUEST_DELETE_DOCUMENT,
    projectId: projectId,
    doucmentid: json.id
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
