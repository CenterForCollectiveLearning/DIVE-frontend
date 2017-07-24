import {
  VISUALIZATION_MODE,
  REQUEST_EXACT_SPECS,
  PROGRESS_EXACT_SPECS,
  RECEIVE_EXACT_SPECS,
  ERROR_EXACT_SPECS,
  REQUEST_INDIVIDUAL_SPECS,
  PROGRESS_INDIVIDUAL_SPECS,
  RECEIVE_INDIVIDUAL_SPECS,
  ERROR_INDIVIDUAL_SPECS,
  REQUEST_SUBSET_SPECS,
  PROGRESS_SUBSET_SPECS,
  RECEIVE_SUBSET_SPECS,
  ERROR_SUBSET_SPECS,
  REQUEST_EXPANDED_SPECS,
  PROGRESS_EXPANDED_SPECS,
  RECEIVE_EXPANDED_SPECS,
  ERROR_EXPANDED_SPECS,
  PROGRESS_SPECS,
  SELECT_RECOMMENDATION_TYPE,
  SELECT_VISUALIZATION_TYPE,
  SELECT_SINGLE_VISUALIZATION_VISUALIZATION_TYPE,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA,
  REQUEST_VISUALIZATION_TABLE_DATA,
  RECEIVE_VISUALIZATION_TABLE_DATA,
  CLEAR_VISUALIZATION,
  CLICK_VISUALIZATION,
  REQUEST_CREATE_SAVED_SPEC,
  RECEIVE_CREATED_SAVED_SPEC,
  REQUEST_CREATE_EXPORTED_SPEC,
  RECEIVE_CREATED_EXPORTED_SPEC,
  SET_SHARE_WINDOW,
  SELECT_SORTING_FUNCTION,
  SELECT_SINGLE_VISUALIZATION_SORT_ORDER,
  SELECT_SINGLE_VISUALIZATION_SORT_FIELD,
  SELECT_CONDITIONAL,
  SET_EXPLORE_QUERY_STRING,
  SELECT_RECOMMENDATION_MODE,
  SELECT_VISUALIZATION_DATA_CONFIG,
  SELECT_VISUALIZATION_DISPLAY_CONFIG
} from '../constants/ActionTypes';

import _ from 'underscore';
import { fetch, pollForTask } from './api.js';
import { formatVisualizationTableData, getFilteredConditionals } from './ActionHelpers.js'

const specLevelToAction = [
  {
    request: REQUEST_EXACT_SPECS,
    progress: PROGRESS_EXACT_SPECS,
    receive: RECEIVE_EXACT_SPECS,
    error: ERROR_EXACT_SPECS
  },
  {
    request: REQUEST_SUBSET_SPECS,
    progress: PROGRESS_SUBSET_SPECS,
    receive: RECEIVE_SUBSET_SPECS,
    error: ERROR_SUBSET_SPECS
  },
  {
    request: REQUEST_INDIVIDUAL_SPECS,
    progress: PROGRESS_INDIVIDUAL_SPECS,
    receive: RECEIVE_INDIVIDUAL_SPECS,
    error: ERROR_INDIVIDUAL_SPECS
  },
  {
    request: REQUEST_EXPANDED_SPECS,
    progress: PROGRESS_EXPANDED_SPECS,
    receive: RECEIVE_EXPANDED_SPECS,
    error: ERROR_EXPANDED_SPECS
  },
]

export function getInitialState(projectId, datasetSelector, fieldProperties) {
  const { nRows, nCols } = datasetSelector.details;
  let recommendationMode = 'expanded';
  if (nRows > 10000 && nCols > 20) {
    recommendationMode = 'regular'
  }
  return {
    recommendationMode: recommendationMode,
    sortBy: 'relevance'
  };
}

export function sortSpecsByFunction(sortingFunction, specA, specB) {
  const scoreObjectSpecA = specA.scores.find((score) => score.type == sortingFunction);
  const scoreObjectSpecB = specB.scores.find((score) => score.type == sortingFunction);

  if (!scoreObjectSpecA && scoreObjectSpecB) {
    return 1; // a < b
  }

  if (scoreObjectSpecA && !scoreObjectSpecB) {
    return -1;
  }

  if (!scoreObjectSpecA && !scoreObjectSpecB) {
    return 0;
  }

  if (scoreObjectSpecA.score == scoreObjectSpecB.score) {
    return 0;
  }

  return (scoreObjectSpecA.score > scoreObjectSpecB.score) ? -1 : 1;
};

export function getValidSpecLevelsFromNumFields(numSelectedFields, selectedRecommendationMode) {
  var isValidSpecLevel = [ false, false, false, false ];
  if (numSelectedFields == 0) {
    isValidSpecLevel[0] = true;  // Exact
  }
  if (numSelectedFields >= 1) {
    isValidSpecLevel[2] = true;  // Individual
    if (selectedRecommendationMode == 'expanded') {
      isValidSpecLevel[3] = true  // Expanded
    }
  }
  if (numSelectedFields >= 2) {
    isValidSpecLevel[0] = true;  // Exact
  }
  if (numSelectedFields >= 3) {
    isValidSpecLevel[1] = true;  // Subset
  }
  return isValidSpecLevel;
}

function requestUpdateVisualizationStatsDispatcher(selectedRecommendationLevel) {
  return {
    type: specLevelToAction[selectedRecommendationLevel].request,
    selectedRecommendationLevel: selectedRecommendationLevel
  };
}

function receiveUpdateVisualizationStatsDispatcher(json) {
  return {
    type: RECEIVE_VISUALIZATION_DATA,
    spec: json.spec,
    exported: json.exported,
    exportedSpecId: json.exportedSpecId,
    tableData: json.visualization.table ? formatVisualizationTableData(json.visualization.table.columns, json.visualization.table.data) : [],
    bins: json.visualization.bins,
    visualizationData: json.visualization.visualize,
    sampleSize: json.visualization.count,
    receivedAt: Date.now()
  };
}

export function updateVisualizationStats(projectId, specId, type='click') {
  return (dispatch) => {
    dispatch(requestUpdateVisualizationStatsDispatcher());
    return fetch(`/visualization/v1/stats?project_id=${projectId}&type=click`)
      .then(function(json) {
        const dispatchParams = {};
        dispatch(receiveUpdateVisualizationStatsDispatcher(dispatchParams, json.result))
      });
  };
}

export function selectRecommendationMode(selectedRecommendationModeId) {
  return {
    type: SELECT_RECOMMENDATION_MODE,
    selectedRecommendationModeId: selectedRecommendationModeId
  };
}

function requestSpecsDispatcher(selectedRecommendationLevel) {
  return {
    type: specLevelToAction[selectedRecommendationLevel].request,
    selectedRecommendationLevel: selectedRecommendationLevel
  };
}

function progressSpecsDispatcherWrapper(selectedRecommendationLevel) {
  return (data) => {
    return {
      type: specLevelToAction[selectedRecommendationLevel].progress,
      progress: (data.currentTask && data.currentTask.length) ? data.currentTask : data.previousTask
    };
  }
}

function errorSpecsDispatcherWrapper(selectedRecommendationLevel) {
  return (data) => {
    return {
      type: specLevelToAction[selectedRecommendationLevel].error,
      message: data.error
    };
  }
}

function receiveSpecsDispatcher(params, json) {
  const recommendationLevel = params.recommendationType ? params.recommendationType.level : null;
  if (json && !json.error) {
    return {
      ...params,
      type: specLevelToAction[recommendationLevel].receive,
      specs: json.map((spec) => new Object({ ...spec, recommendationLevel })),
      receivedAt: Date.now()
    };
  }

  return {
    ...params,
    type: specLevelToAction[recommendationLevel].error,
    specs: [],
    receivedAt: Date.now(),
    error: (json && json.message) ? json.message : "Error retrieving visualizations."
  };
}

export function fetchSpecs(projectId, datasetId, selectedFieldProperties, recommendationType = null) {
  const selectedRecommendationType = recommendationType ? recommendationType.id : null;
  const selectedRecommendationLevel = recommendationType ? recommendationType.level : null;

  const fieldAggPairs = selectedFieldProperties
    .map((property) =>
      new Object({
        'field_id': property.id,
        'agg_fn': undefined  // TODO Restore functionality eventually
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
    'recommendation_types': [ selectedRecommendationType ],
    'conditionals': conditionals
  };

  const dispatchers = {
    success: receiveSpecsDispatcher,
    progress: progressSpecsDispatcherWrapper(selectedRecommendationLevel),
    error: errorSpecsDispatcherWrapper(selectedRecommendationLevel)
  }

  return dispatch => {
    dispatch(requestSpecsDispatcher(selectedRecommendationLevel));

    return fetch(`/specs/v1/specs`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(function(json) {
        const dispatchParams = { project_id: projectId, dataset_id: datasetId, recommendationType: recommendationType };
        if (json.compute) {
          dispatch(pollForTask(json.taskId, VISUALIZATION_MODE, specLevelToAction[selectedRecommendationLevel].request, dispatchParams, dispatchers));
        } else {
          dispatch(receiveSpecsDispatcher(dispatchParams, json.result));
        }
      })
  };
}

export function selectRecommendationType(selectedRecommendationType) {
  return {
    type: SELECT_RECOMMENDATION_TYPE,
    selectedRecommendationType: selectedRecommendationType
  }
}

export function selectVisualizationType(selectedType) {
  return {
    type: SELECT_VISUALIZATION_TYPE,
    selectedType: selectedType
  }
}

export function selectSingleVisualizationSortField(selectedSortFieldId) {
  return {
    type: SELECT_SINGLE_VISUALIZATION_SORT_FIELD,
    selectedSortFieldId: selectedSortFieldId
  }
}

export function selectSingleVisualizationSortOrder(selectedSortOrderId) {
  return {
    type: SELECT_SINGLE_VISUALIZATION_SORT_ORDER,
    selectedSortOrderId: selectedSortOrderId
  }
}

export function selectSingleVisualizationVisualizationType(selectedType) {
  return {
    type: SELECT_SINGLE_VISUALIZATION_VISUALIZATION_TYPE,
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
    tableData: json.visualization ? (json.visualization.table ? formatVisualizationTableData(json.visualization.table.columns, json.visualization.table.data) : []) : [],
    bins: json.visualization ? json.visualization.bins : [],
    visualizationData: json.visualization ? json.visualization.visualize : [],
    sampleSize: json.visualization ? json.visualization.count : null,
    subset: json.visualization.subset,
    receivedAt: Date.now()
  };
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

function requestVisualizationTableDataDispatcher() {
  return {
    type: REQUEST_VISUALIZATION_TABLE_DATA,
  };
}

function receiveVisualizationTableDataDispatcher(json) {
  console.log(json);
  return {
    type: RECEIVE_VISUALIZATION_TABLE_DATA,
    spec: json.spec,
    tableData: json.visualization ? (json.visualization.table ? formatVisualizationTableData(json.visualization.table.columns, json.visualization.table.data) : []) : [],
    receivedAt: Date.now()
  };
}

export function getVisualizationTableData(projectId, specId, conditionals = [], config = null) {
  const params = {
    project_id: projectId,
    data_formats: [ 'table' ]
  }

  const filteredConditionals = getFilteredConditionals(conditionals);
  if (filteredConditionals && Object.keys(filteredConditionals).length > 0) {
    params.conditionals = filteredConditionals;
  }

  if (config) {
    params.config = config;
  }

  return dispatch => {
    dispatch(requestVisualizationTableDataDispatcher());
    return fetch(`/specs/v1/specs/${ specId }/visualization?project_id=${ projectId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(json => dispatch(receiveVisualizationTableDataDispatcher(json)));
  };
}

export function selectConditional(conditional) {
  return {
    type: SELECT_CONDITIONAL,
    conditional: conditional
  }
}

export function selectVisualizationDataConfig(key, value) {
  return {
    type: SELECT_VISUALIZATION_DATA_CONFIG,
    key: key,
    value: value
  }
}

export function selectVisualizationDisplayConfig(key, value) {
  return {
    type: SELECT_VISUALIZATION_DISPLAY_CONFIG,
    key: key,
    value: value
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
    }).then(json => dispatch(receiveCreatedExportedSpecDispatcher(receiveAction, json)))
      .catch(err => console.error("Error creating exported spec: ", err));
  };
}

export function setShareWindow(shareWindow) {
  return {
    type: SET_SHARE_WINDOW,
    shareWindow: shareWindow
  }
}

export function setPersistedQueryString(queryString, resetState=true) {
  return {
    type: SET_EXPLORE_QUERY_STRING,
    queryString: queryString,
    resetState: resetState
  }
}
