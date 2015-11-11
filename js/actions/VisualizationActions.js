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
  SET_SHARE_WINDOW,
  SELECT_SORTING_FUNCTION,
  SELECT_BUILDER_SORT_ORDER,
  SELECT_BUILDER_SORT_FIELD,
  SET_GALLERY_QUERY_STRING
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

export function selectVisualizationType(selectedType) {
  return {
    type: SELECT_VISUALIZATION_TYPE,
    selectedType: selectedType
  }
}

export function selectBuilderSortOrder(selectedSortOrder) {
  return {
    type: SELECT_BUILDER_SORT_ORDER,
    selectedSortOrder: selectedSortOrder
  }
}

export function selectBuilderSortField(selectedSortField) {
  return {
    type: SELECT_BUILDER_SORT_FIELD,
    selectedSortField: selectedSortField
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
