import {
  DATASET_MODE,
  TRANSFORM_MODE,
  SELECT_DATASET,
  REQUEST_DATASET,
  RECEIVE_DATASET,
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  DELETED_DATASET,
  REQUEST_UPLOAD_DATASET,
  PROGRESS_UPLOAD_DATASET,
  ERROR_UPLOAD_DATASET,
  RECEIVE_UPLOAD_DATASET,
  PROGRESS_TRANSFORM,
  REQUEST_REDUCE_DATASET_COLUMNS,
  REQUEST_MERGE_DATASETS,
  SET_DATASET_INSPECT_QUERY_STRING
} from '../constants/ActionTypes';

import { batchActions } from 'redux-batched-actions';

import { fetch, httpRequest, pollForTask } from './api.js';
import { formatTableData } from './ActionHelpers.js'

export function getInitialState() {
  return {
    selectedLayoutType: 'list',
  };
}

export function setInspectQueryString(queryString) {
  return {
    type: SET_DATASET_INSPECT_QUERY_STRING,
    queryString: queryString
  }
}

export function selectDataset(projectId, datasetId) {
  return {
    type: SELECT_DATASET,
    projectId: projectId,
    id: datasetId
  };
}

function requestDatasetsDispatcher(projectId) {
  return {
    type: REQUEST_DATASETS,
    projectId: projectId
  };
}

function receiveDatasetsDispatcher(projectId, json, setSelector) {
  return {
    type: RECEIVE_DATASETS,
    projectId: projectId,
    datasets: json.datasets,
    receivedAt: Date.now(),
    setSelector: setSelector
  };
}

export function fetchDatasets(projectId, setSelector = true) {
  return dispatch => {
    dispatch(requestDatasetsDispatcher(projectId));
    return fetch('/datasets/v1/datasets?project_id=' + projectId)
      .then(json => dispatch(receiveDatasetsDispatcher(projectId, json, setSelector)));
  };
}

function requestUploadDatasetDispatcher() {
  return {
    type: REQUEST_UPLOAD_DATASET
  };
}

function progressUploadDatasetDispatcher(event) {
  const percent = event.loaded ? ( ' ' + Math.round(event.loaded / event.total * 100) + '%') : ''
  return {
    type: PROGRESS_UPLOAD_DATASET,
    progress: `Uploading dataset…${ percent }`
  }
}

function progressTaskUploadDatasetDispatcher(data) {
  return {
    type: PROGRESS_UPLOAD_DATASET,
    progress: data.currentTask
  }
}

function errorTaskUploadDatasetDispatcher(json) {
  return {
    type: ERROR_UPLOAD_DATASET,
    error: json.message ? json.message : 'Error uploading dataset'
  }
}

function receiveUploadDatasetDispatcher(params, json) {
  if (json) {
    return {
      type: RECEIVE_UPLOAD_DATASET,
      datasets: [{ id: json.id }],
      projectId: params.projectId,
      error: null
    };
  }
  return {
    type: RECEIVE_UPLOAD_DATASET,
    datasets: [],
    projectId: params.projectId,
    error: "Sorry, this dataset is too large for us to process right now."
  };
}

const allSeparators = [ ',', '\t', ':', ' ', ':' ];
const parseableMimeTypesToSeparators = {
  'text/csv': [','],
  'text/x-csv': [','],
  'text/comma-separated-values': [','],
  'text/x-comma-separated-values': [','],
  'application/csv': [','],
  'application/x-csv': [','],
  'text/tab-separated-values': ['\t'],
  'text/plain': allSeparators,
  'application/octet-stream': allSeparators
}

const parseableMimeTypes = Object.keys(parseableMimeTypesToSeparators);

const skipParsingMimetimes = [
  'application/excel',
  'application/vnd.ms-excel',
  'application/msexcel',
  'application/x-msexcel',
  'application/x-excel',
  'application/x-dos_ms_excel',
  'application/xls',
  'application/x-xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/json',
]

const acceptedMimetypes = parseableMimeTypes + skipParsingMimetimes;

function getNumColumns(rowSample, mimeType) {
  const columnSeparators = parseableMimeTypesToSeparators[mimeType];
  var separator = null;
  var max = 0;
  for (var row of rowSample) {
    for (var columnSeparator of columnSeparators) {
      var numColumns = row.split(columnSeparator).length;
      if (numColumns > max) {
        max = numColumns
        separator = null;
      }
    }
  }
  return max;
}

function datasetOverSizeLimit(result, mimeType=null) {
  const ROW_LIMIT = (window.__env.NODE_ENV == 'DEVELOPMENT') ? Number.MAX_SAFE_INTEGER : 100000;
  const COLUMN_LIMIT = (window.__env.NODE_ENV == 'DEVELOPMENT') ? Number.MAX_SAFE_INTEGER : 40;

  const rowSeparator = /[\r\n]+/g;
  const rows = result.split(rowSeparator);
  const rowSample = rows.slice(0, 10);
  const numRows = rows.length;

  if (numRows > ROW_LIMIT) {
    return `Uploaded file has ${ numRows } rows, exceeding row limit of ${ ROW_LIMIT }.`;
  } else {
    const numColumns = getNumColumns(rowSample, mimeType)
    if (numColumns > COLUMN_LIMIT) {
      return `Uploaded file has ${ numColumns } columns, exceeding column limit of ${ COLUMN_LIMIT }.`;
    }
  }
  return false;
}

export function uploadDataset(projectId, datasetFile) {
  var formData = new FormData();
  formData.append('data', JSON.stringify({ project_id: projectId }));
  formData.append('file', datasetFile);

  const { size: fileSize, type: mimeType } = datasetFile;
  const MB = 1000 * 1000;
  let fileSizeLimit = (window.__env.NODE_ENV == 'DEVELOPMENT') ? 1000*MB : 10*MB;

  return (dispatch) => {

    const uploadEvents = [
      {
        type: 'progress',
        function: (event) => {
          dispatch(progressUploadDatasetDispatcher(event));
        }
      },
      {
        type: 'error',
        function: (event) => {
          dispatch(errorTaskUploadDatasetDispatcher(event));
        }
      },
    ];

    const dispatchers = {
      success: ((params, json) => batchActions([
        receiveUploadDatasetDispatcher(params, json),
        selectDataset(params.projectId, json.id)
      ])),
      progress: progressTaskUploadDatasetDispatcher,
      error: errorTaskUploadDatasetDispatcher
    }

    const completeEvent = (request) => (evt) => {
      const { responseText, status } = request;
      const json = JSON.parse(responseText);
      if (status == 202) {
        const { taskId } = json;
        dispatch(pollForTask(taskId, DATASET_MODE, REQUEST_UPLOAD_DATASET, {}, dispatchers));
      } else if ( status > 400 ) {
        dispatch(errorTaskUploadDatasetDispatcher(json));
      }
    };

    if (fileSize > fileSizeLimit) {
      return dispatch(errorTaskUploadDatasetDispatcher({
        type: 'error',
        message: `File size is too large (${ fileSizeLimit / MB }MB limit)`
      }));
    }

    if (!acceptedMimetypes.includes(mimeType)) {
      return dispatch(errorTaskUploadDatasetDispatcher({
        type: 'error',
        message: `Uploaded file mimetime ${ mimeType } invalid.`
      }));
    }

    if ((window.File && window.FileReader && window.FileList && window.Blob) && parseableMimeTypes.includes(mimeType)) {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
        const result = event.target.result;
        const overSizeLimit = datasetOverSizeLimit(result, mimeType);
        if (overSizeLimit) {
          return dispatch(errorTaskUploadDatasetDispatcher({
            type: 'error',
            message: overSizeLimit
          }));
        } else {
          dispatch(requestUploadDatasetDispatcher());
          return httpRequest('POST', '/datasets/v1/upload', formData, completeEvent, uploadEvents);
        }
      }
      fileReader.readAsText(datasetFile);
    } else {
      dispatch(requestUploadDatasetDispatcher());
      return httpRequest('POST', '/datasets/v1/upload', formData, completeEvent, uploadEvents);
    }
  };
}

function requestDatasetDispatcher(projectId, datasetId) {
  return {
    type: REQUEST_DATASET,
    projectId: projectId,
    id: datasetId
  };
}

function receiveDatasetDispatcher(params, json) {
  return {
    type: RECEIVE_DATASET,
    id: json.id,
    projectId: json.projectId,
    preloaded: json.preloaded,
    title: json.title,
    details: json.details,
    data: json.details ? formatTableData(json.details.fieldNames, json.details.sample) : []
  }
}

export function fetchDataset(projectId, datasetId) {
  return (dispatch) => {
    dispatch(requestDatasetDispatcher(projectId, datasetId));
    return fetch(`/datasets/v1/datasets/${ datasetId }?project_id=${projectId}`)
      .then(json => dispatch(receiveDatasetDispatcher({}, json)));
  };
}

function deletedDatasetDispatcher(datasetId, json) {
  return {
    type: DELETED_DATASET,
    id: datasetId
  };
}

export function deleteDataset(projectId, datasetId) {
  return (dispatch) => {
    return fetch(`/datasets/v1/datasets/${ datasetId }?project_id=${ projectId }`, {
      method: 'delete'
    }).then(json => dispatch(deletedDatasetDispatcher(datasetId, json)));
  };
}

function progressTransformDispatcher(data) {
  return {
    type: PROGRESS_TRANSFORM,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorTransformDispatcher(data) {
  return {
    type: ERROR_TRANSFORM,
    progress: 'Error transforming dataset, please check console.'
  };
}

export function requestReduceDatasetColumnsDispatcher(datasetId, columnIds) {
  return {
    type: REQUEST_REDUCE_DATASET_COLUMNS,
    id: datasetId,
    columnIds: columnIds
  };
}

export function reduceDatasetColumns(projectId, datasetId, columnIds=[]) {
  const params = {
    'project_id': projectId,
    'dataset_id': datasetId,
    'column_ids': columnIds
  };

  const dispatchers = {
    success: receiveDatasetDispatcher,
    progress: progressTransformDispatcher,
    error: errorTransformDispatcher
  }

  return (dispatch) => {
    dispatch(requestReduceDatasetColumnsDispatcher(datasetId, columnIds));
    return fetch(`/datasets/v1/reduce?project_id=${ projectId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        const dispatchParams = { projectId };
        dispatch(pollForTask(json.taskId, TRANSFORM_MODE, REQUEST_REDUCE_DATASET_COLUMNS, dispatchParams, dispatchers));
      });
  };
}

function requestPivotDatasetColumnsDispatcher(datasetId, variableName, valueName, columnIds) {
  return {
    type: REQUEST_REDUCE_DATASET_COLUMNS,
    id: datasetId,
    columnIds: columnIds,
    variableName: variableName,
    valueName: valueName
  };
}

export function pivotDatasetColumns(projectId, datasetId, variableName, valueName, columnIds=[]) {
  const params = {
    project_id: projectId,
    dataset_id: datasetId,
    pivot_fields: columnIds,
    variable_name: variableName,
    value_name: valueName
  };

  const dispatchers = {
    success: receiveDatasetDispatcher,
    progress: progressTransformDispatcher,
    error: errorTransformDispatcher
  }

  return (dispatch) => {
    dispatch(requestPivotDatasetColumnsDispatcher(datasetId, variableName, valueName, columnIds));
    return fetch(`/datasets/v1/unpivot?project_id=${ projectId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        const dispatchParams = { projectId };
        dispatch(pollForTask(json.taskId, TRANSFORM_MODE, REQUEST_REDUCE_DATASET_COLUMNS, dispatchParams, dispatchers));
      });
  };
}

function requestMergeDatasetsDispatcher(leftDatasetId, rightDatasetId, onColumnsIds, mergeMethod) {
  return {
    type: REQUEST_MERGE_DATASETS,
    leftDatasetId: leftDatasetId,
    rightDatasetId: rightDatasetId,
    onColumnsIds: onColumnsIds,
    mergeMethod: mergeMethod
  };
}

export function mergeDatasets(projectId, leftDatasetId, rightDatasetId, onColumnsIds=[], mergeMethod='left') {
  const params = {
    project_id: projectId,
    left_dataset_id: leftDatasetId,
    right_dataset_id: rightDatasetId,
    on: onColumnsIds,
    how: mergeMethod
  };

  const dispatchers = {
    success: receiveDatasetDispatcher,
    progress: progressTransformDispatcher
  }

  return (dispatch) => {
    dispatch(requestMergeDatasetsDispatcher(leftDatasetId, rightDatasetId, onColumnsIds, mergeMethod));
    return fetch(`/datasets/v1/join?project_id=${ projectId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        const dispatchParams = {};
        dispatch(pollForTask(json.taskId, TRANSFORM_MODE, REQUEST_MERGE_DATASETS, dispatchParams, dispatchers));
      });
  };
}
