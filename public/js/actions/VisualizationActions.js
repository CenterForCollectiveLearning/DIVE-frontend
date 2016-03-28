import {
  REQUEST_SPECS,
  PROGRESS_SPECS,
  RECEIVE_SPECS,
  FAILED_RECEIVE_SPECS,
  SELECT_VISUALIZATION_TYPE,
  SELECT_BUILDER_VISUALIZATION_TYPE,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA,
  CLEAR_VISUALIZATION,
  REQUEST_CREATE_SAVED_SPEC,
  RECEIVE_CREATED_SAVED_SPEC,
  REQUEST_CREATE_EXPORTED_SPEC,
  RECEIVE_CREATED_EXPORTED_SPEC,
  SET_SHARE_WINDOW,
  SELECT_SORTING_FUNCTION,
  SELECT_BUILDER_SORT_ORDER,
  SELECT_BUILDER_SORT_FIELD,
  SELECT_VISUALIZATION_CONDITIONAL,
  SELECT_VISUALIZATION_CONFIG,
  SET_GALLERY_QUERY_STRING
} from '../constants/ActionTypes';

import { fetch, pollForTask } from './api.js';
import { formatTableData } from './ActionHelpers.js'

function requestSpecsDispatcher() {
  return {
    type: REQUEST_SPECS
  };
}

function progressSpecsDispatcher(data) {
  return {
    type: PROGRESS_SPECS,
    progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
  };
}

function errorSpecsDispatcher(data) {
  return {
    type: PROGRESS_SPECS,
    progress: 'Error processing visualizations, please check console.'
  };
}

function receiveSpecsDispatcher(params, json) {
  if (json && !json.error) {
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
    receivedAt: Date.now(),
    error: (json && json.error) ? json.error : "Error retrieving visualizations."
  };
}

export function fetchSpecs(projectId, datasetId, fieldProperties = []) {
  const selectedFieldProperties = fieldProperties.filter((property) => property.selected);

  const fieldAggPairs = selectedFieldProperties
    .map((property) =>
      new Object({
        'field_id': property.id,
        'agg_fn': property.aggregations ?
          property.aggregations.find((aggregation) => aggregation.selected).value
          : undefined
      })
    );

  const selectedFieldPropertiesWithConditionals = selectedFieldProperties
    .filter((property) => property.values && property.values.findIndex((valueObj) => valueObj.selected) != 0);

  const conditionals = !selectedFieldPropertiesWithConditionals.length ? {} : {
    'and': selectedFieldPropertiesWithConditionals.map((property) =>
        new Object({
          'field_id': property.id,
          'operation': '==',
          'criteria': property.values.find((valueObj) => valueObj.selected).value
        })
      )
  };

  const params = {
    'project_id': projectId,
    'dataset_id': datasetId,
    'field_agg_pairs': fieldAggPairs,
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
        if (json.compute) {
          dispatch(pollForTask(json.taskId, REQUEST_SPECS, dispatchParams, receiveSpecsDispatcher, progressSpecsDispatcher, errorSpecsDispatcher));
        } else {
          dispatch(receiveSpecsDispatcher(dispatchParams, json.result));
        }
      })
  };
}

export function selectVisualizationType(selectedType) {
  return {
    type: SELECT_VISUALIZATION_TYPE,
    selectedType: selectedType
  }
}

export function selectBuilderSortField(selectedSortFieldId) {
  return {
    type: SELECT_BUILDER_SORT_FIELD,
    selectedSortFieldId: selectedSortFieldId
  }
}

export function selectBuilderSortOrder(selectedSortOrderId) {
  return {
    type: SELECT_BUILDER_SORT_ORDER,
    selectedSortOrderId: selectedSortOrderId
  }
}

export function selectBuilderVisualizationType(selectedType) {
  return {
    type: SELECT_BUILDER_VISUALIZATION_TYPE,
    selectedType: selectedType
  }
}

export function selectSortingFunction(selectedSortingFunction) {
  return {
    type: SELECT_SORTING_FUNCTION,
    selectedSortingFunction: selectedSortingFunction
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
    exported: json.exported,
    exportedSpecId: json.exportedSpecId,
    tableData: formatTableData(json.visualization.table.columns, json.visualization.table.data),
    visualizationData: json.visualization.visualize,
    receivedAt: Date.now()
  };
}

function getFilteredConditionals(conditionals) {
  const validConditionals = conditionals.filter((conditional) =>
    conditional.conditionalIndex != null && conditional.value != "ALL_VALUES" && conditional.value != ""
  );

  conditionals = null;

  if (validConditionals.length) {
    conditionals = {};

    validConditionals.forEach((conditional) => {
      if (!conditionals[conditional.combinator]) {
        conditionals[conditional.combinator] = [];
      }

      conditionals[conditional.combinator].push({
        'field_id': conditional.fieldId,
        'operation': conditional.operator,
        'criteria': conditional.value
      })
    });
  }
  return conditionals
}


function fetchSpecVisualization(projectId, specId, conditionals = [], config = null) {
  const params = {
    project_id: projectId
  }

  const filteredConditionals = getFilteredConditionals(conditionals);

  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  if (config) {
    params.config = config;
  }

  return dispatch => {
    dispatch(requestSpecVisualizationDispatcher());
    return fetch(`/specs/v1/specs/${ specId }/visualization?project_id=${ projectId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(json => dispatch(receiveSpecVisualizationDispatcher(json)));
  };
}

function shouldFetchSpecVisualization(state) {
  const { visualization } = state;
  if (visualization.specId || visualization.isFetching) {
    return false;
  }
  return true;
}

export function fetchSpecVisualizationIfNeeded(projectId, specId, conditionals, config) {
  return (dispatch, getState) => {
    if (shouldFetchSpecVisualization(getState())) {
      return dispatch(fetchSpecVisualization(projectId, specId, conditionals, config));
    }
  };
}

export function selectVisualizationConditional(conditional) {
  return {
    type: SELECT_VISUALIZATION_CONDITIONAL,
    conditional: conditional
  }
}

export function selectVisualizationConfig(config) {
  return {
    type: SELECT_VISUALIZATION_CONFIG,
    config: config
  }
}

export function clearVisualization() {
  return {
    type: CLEAR_VISUALIZATION
  };
}

function requestCreateExportedSpecDispatcher(action) {
  return {
    type: action
  };
}

function receiveCreatedExportedSpecDispatcher(action, json) {
  return {
    type: action,
    exportedSpecId: json.id,
    specId: json.specId,
    exportedSpec: json,
    receivedAt: Date.now()
  };
}

export function createExportedSpec(projectId, specId, data, conditionals=[], config={}, saveAction = false) {
  const requestAction = saveAction ? REQUEST_CREATE_SAVED_SPEC : REQUEST_CREATE_EXPORTED_SPEC;
  const receiveAction = saveAction ? RECEIVE_CREATED_SAVED_SPEC : RECEIVE_CREATED_EXPORTED_SPEC;

  const filteredConditionals = getFilteredConditionals(conditionals);

  const params = {
    project_id: projectId,
    spec_id: specId,
    data: data,
    conditionals: filteredConditionals ? filteredConditionals : {},
    config: config
  }

  return dispatch => {
    dispatch(requestCreateExportedSpecDispatcher(requestAction));
    return fetch('/exported_specs/v1/exported_specs', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json => dispatch(receiveCreatedExportedSpecDispatcher(receiveAction, json)))
      .catch(err => console.error("Error creating exported spec: ", err));
  };
}

export function setShareWindow(shareWindow) {
  return {
    type: SET_SHARE_WINDOW,
    shareWindow: shareWindow
  }
}

export function setGalleryQueryString(query) {
  var queryString = '';

  Object.keys(query).forEach(
    function (fullKey, index, array) {
      const key = fullKey.slice(0, -2);
      var fieldString = '';
      if (Array.isArray(query[fullKey])) {
        query[fullKey].forEach((c, i, a) =>
          fieldString = fieldString + `&${ key }[]=${ c }`
        )
      } else {
        fieldString = `&${ key }[]=${ query[fullKey] }`;
      }
      queryString = queryString + fieldString;
    }
  );

  queryString = queryString.replace('&', '?');

  return {
    type: SET_GALLERY_QUERY_STRING,
    queryString: queryString
  }
}
