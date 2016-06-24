import {
  REQUEST_EXPORTED_VISUALIZATION_SPECS,
  RECEIVE_EXPORTED_VISUALIZATION_SPECS,
  REQUEST_EXPORTED_ANALYSES,
  RECEIVE_EXPORTED_ANALYSES,
  SELECT_DOCUMENT,
  REQUEST_PUBLISHED_DOCUMENT,
  RECEIVE_PUBLISHED_DOCUMENT,
  REQUEST_DOCUMENTS,
  RECEIVE_DOCUMENTS,
  REQUEST_CREATE_DOCUMENT,
  RECEIVE_CREATE_DOCUMENT,
  REQUEST_UPDATE_DOCUMENT,
  RECEIVE_UPDATE_DOCUMENT,
  REQUEST_DELETE_DOCUMENT,
  RECEIVE_DELETE_DOCUMENT,
  SELECT_COMPOSE_CONTENT,
  REMOVE_COMPOSE_CONTENT,
  MOVE_COMPOSE_BLOCK,
  REQUEST_SAVE_DOCUMENT,
  RECEIVE_SAVE_DOCUMENT,
  SET_DOCUMENT_TITLE,
  SAVE_BLOCK
} from '../constants/ActionTypes';

import _ from 'underscore'

import { fetch, pollForTask } from './api.js';

export function selectComposeContent(contentType, contentId, title) {
  return {
    type: SELECT_COMPOSE_CONTENT,
    contentType: contentType,
    contentId: contentId,
    title: title
  }
}

export function removeComposeBlock(blockId) {
  return {
    type: REMOVE_COMPOSE_CONTENT,
    blockId: blockId
  }
}

function moveComposeBlockDispatcher(blockId, direction) {
  return {
    type: MOVE_COMPOSE_BLOCK,
    blockId: blockId,
    direction: direction
  }
}

export function moveComposeBlock(blockId, direction) {
  return (dispatch, getState) => {
    dispatch(moveComposeBlockDispatcher(blockId, direction));
    debouncedChangeDocument(dispatch, getState);
  }
}

export function setVisualizationFormat(exportedSpecId, format) {
  return {
    type: SET_BLOCK_FORMAT,
    exportedSpecId: exportedSpecId,
    format: format
  }
}

function requestExportedAnalysesDispatcher() {
  return {
    type: REQUEST_EXPORTED_ANALYSES
  };
}

function receiveExportedAnalysesDispatcher(params, json) {
  if (json && !json.error) {
    return {
      ...params,
      type: RECEIVE_EXPORTED_ANALYSES,
      analyses: json,
      receivedAt: Date.now()
    };
  }
}

export function fetchExportedAnalyses(projectId) {
  return (dispatch) => {
    dispatch(requestExportedAnalysesDispatcher());
    return fetch(`/exported_results/v1/exported_results?project_id=${projectId}&result_type=regression&result_type=correlation`)
      .then(response => response.json())
      .then(function(json) {
        const dispatchParams = {};
        dispatch(receiveExportedAnalysesDispatcher(dispatchParams, json.result))
      });
  };
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
      .then(function(json) {
        const dispatchParams = {};
        dispatch(receiveExportedVisualizationSpecsDispatcher(dispatchParams, json.result))
      });
  };
}

function selectDocumentDispatcher(documentId, blocks=[], title=null) {
  return {
    type: SELECT_DOCUMENT,
    blocks: blocks,
    documentId: documentId,
    title: title
  };
}

export function selectDocument(documentId) {
  return (dispatch, getState) => {
    const { documents } = getState()
    const foundDocument = documents.items.find((doc) => doc.id == documentId);
    if (foundDocument) {
      dispatch(selectDocumentDispatcher(documentId, foundDocument.content.blocks, foundDocument.title));
    } else {
      dispatch(selectDocumentDispatcher(documentId));
    }
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

function requestPublishedDocumentDispatcher(documentId) {
  return {
    type: REQUEST_PUBLISHED_DOCUMENT,
    documentId: documentId
  };
}

function receivePublishedDocumentDispatcher(documentId, json) {
  return {
    type: RECEIVE_PUBLISHED_DOCUMENT,
    documentId: documentId,
    document: json,
    receivedAt: Date.now(),
  };
}

export function fetchPublishedDocument(documentId) {
  return (dispatch) => {
    dispatch(requestPublishedDocumentDispatcher(documentId));
    return fetch(`/compose/v1/document/${ documentId }?include_data=true`)
      .then(function(json) {
        const dispatchParams = {};
        dispatch(receivePublishedDocumentDispatcher(documentId, json))
      });
  };
}

export function fetchDocuments(projectId) {
  return (dispatch) => {
    dispatch(requestDocumentsDispatcher(projectId));
    return fetch(`/compose/v1/documents?project_id=${projectId}`)
      .then(function(json) {
        const dispatchParams = {};
        dispatch(receiveDocumentsDispatcher(dispatchParams, json))
      });
  };
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
    }).then(json => dispatch(receiveCreateDocumentDispatcher(projectId, json)))
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
    documentId: json.id
  };
}

export function deleteDocument(projectId, documentId) {
  return (dispatch) => {
    dispatch(requestDeleteDocumentDispatcher(projectId, documentId));
    return fetch(`/compose/v1/document/${ documentId }?project_id=${projectId}`, {
      method: 'delete'
    }).then(json => dispatch(receiveDeleteDocumentDispatcher(projectId, json)))
  }
}

function requestSaveDocumentDispatcher(projectId, documentId, title, content) {
  return {
      type: REQUEST_SAVE_DOCUMENT,
      projectId: projectId,
      documentId: documentId,
      content: content,
      title: title
  };
}

function receiveSaveDocumentDispatcher(projectId, documentId, json) {
  return {
      type: RECEIVE_SAVE_DOCUMENT,
      projectId: projectId,
      documentId: documentId
  };
}

function saveDocument(dispatch, getState) {
  const { project, composeSelector } = getState();
  const projectId = project.properties.id;
  const { documentId, blocks, title } = composeSelector;

  const content = { 'blocks': blocks };
  const params = {
    project_id: projectId,
    content: content,
    title: title
  }

  dispatch(requestSaveDocumentDispatcher(projectId, documentId, title, content));
  return fetch(`/compose/v1/document/${ documentId }`, {
    method: 'put',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' }
  }).then(json => dispatch(receiveSaveDocumentDispatcher(projectId, documentId, json)))
}

const debouncedChangeDocument = _.debounce(saveDocument, 800);

function saveBlockDispatcher(blockId, key, value) {
  var action = {
    type: SAVE_BLOCK,
    blockId: blockId,
    key: key,
    meta: {
      debounce: {
        time: 800
      }
    }
  };
  action[key] = value;
  return action;
}

export function saveBlock(blockId, key, value) {
  return (dispatch, getState) => {
    dispatch(saveBlockDispatcher(blockId, key, value));
    debouncedChangeDocument(dispatch, getState);
  }
}

function setDocumentTitleDispatcher(title) {
  return {
    type: SET_DOCUMENT_TITLE,
    title: title
  };
}

export function saveDocumentTitle(documentId, title) {
  return (dispatch, getState) => {
    dispatch(setDocumentTitleDispatcher(title));
    debouncedChangeDocument(dispatch, getState);
  }
}
