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
  REQUEST_CREATE_EXPORTED_SPEC,
  RECEIVE_CREATED_EXPORTED_SPEC,
  SET_SHARE_WINDOW,
  SELECT_SORTING_FUNCTION,
  SELECT_BUILDER_SORT_ORDER,
  SELECT_BUILDER_SORT_FIELD,
  SELECT_VISUALIZATION_CONDITIONAL,
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
    error: json.error || "Error retrieving visualizations."
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
        dispatch(pollForTask(json.taskId, REQUEST_SPECS, dispatchParams, receiveSpecsDispatcher, progressSpecsDispatcher));
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
    tableData: formatTableData(json.visualization.table.columns, json.visualization.table.data),
    visualizationData: json.visualization.visualize,
    receivedAt: Date.now()
  };
}

function fetchSpecVisualization(projectId, specId, conditionals) {
  const params = {
    project_id: projectId
  }

  const validConditionals = conditionals.filter((conditional) => conditional.conditionalIndex != null);
  if (validConditionals.length) {
    params.conditionals = {
      'and': validConditionals.map((conditional) =>
        new Object({
          'field_id': conditional.fieldId,
          'operation': conditional.operator,
          'criteria': conditional.value
        }))
    };
  }

  return dispatch => {
    dispatch(requestSpecVisualizationDispatcher());
    return fetch(`/specs/v1/specs/${ specId }/visualization?project_id=${ projectId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
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

export function fetchSpecVisualizationIfNeeded(projectId, specId, conditionals) {
  return (dispatch, getState) => {
    if (shouldFetchSpecVisualization(getState())) {
      return dispatch(fetchSpecVisualization(projectId, specId, conditionals));
    }
  };
}

export function selectVisualizationConditional(conditional) {
  return {
    type: SELECT_VISUALIZATION_CONDITIONAL,
    conditional: conditional
  }
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

export function setGalleryQueryString(query) {
  var queryString = '';

  Object.keys(query).forEach(
    function (currentValue, index, array) {
      var fieldString = '';
      if (Array.isArray(query[currentValue])) {
        query[currentValue].forEach((c, i, a) =>
          fieldString = fieldString + `&${ currentValue }[]=${ c }`
        )
      } else {
        fieldString = `&${ currentValue }=${ query[currentValue] }`;
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
