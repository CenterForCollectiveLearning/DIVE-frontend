import { combineReducers } from 'redux';
import {routerStateReducer as router} from 'redux-react-router';
import { LOAD, SAVE } from 'redux-storage';

import {
  CREATE_ANONYMOUS_USER,
  CREATE_PROJECT,
  CREATED_PROJECT,
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  RECEIVE_UPLOAD_DATASET,
  RECEIVE_DATASET,
  REQUEST_SPECS,
  RECEIVE_SPECS,
  SELECT_DATASET,
  SELECT_VISUALIZATION_TYPE,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA
} from '../constants/ActionTypes';

function mergeDatasetLists(originalList, newList) {
  var mergedList = [];

  originalList.forEach(function (originalListDataset, i, originalList) {
    mergedList.push(originalListDataset);

    var newListDatasetIndex = newList.findIndex((newListDataset, j, datasets) =>
      newListDataset.datasetId == originalListDataset.datasetId
    );

    if (newListDatasetIndex > -1) {
      var newListDataset = newList[newListDatasetIndex];
      mergedList[i].data = newListDataset.data ? newListDataset.data : mergedList[i].data;
      mergedList[i].title = newListDataset.title ? newListDataset.title : mergedList[i].title;
      mergedList[i].details = newListDataset.details ? newListDataset.details : mergedList[i].details;
      mergedList[i].filename = newListDataset.filename ? newListDataset.filename : mergedList[i].filename;
    }
  });

  newList.forEach(function (newListDataset, i, newList) {
    var newListDatasetIndex = mergedList.findIndex((mergedListDataset, j, datasets) =>
      mergedListDataset.datasetId == newListDataset.datasetId
    );

    if (newListDatasetIndex < 0) {
      mergedList.push(newListDataset);
    }
  });

  return mergedList;
}

function datasets(state = {
  isFetching: false,
  loaded: false,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_DATASETS:
      return { ...state, isFetching: true };
    case RECEIVE_DATASETS:
      return { ...state, isFetching: false, items: mergeDatasetLists(state.items, action.datasets) };
    case RECEIVE_UPLOAD_DATASET:
      return { ...state, isFetching: false, items: [...state.items, { datasetId: action.datasetId }] };
    case RECEIVE_DATASET:
      const newDataset = [{
          datasetId: action.datasetId,
          title: action.title,
          data: action.data,
          details: action.details
      }];
      return { ...state, items: mergeDatasetLists(state.items, newDataset) };
    default:
      return state;
  }
}

function specSelector(state = {
  datasetId: null,
  loaded: false
}, action) {
  switch (action.type) {
    case SELECT_DATASET:
      return { ...state, datasetId: action.datasetId };
    case RECEIVE_UPLOAD_DATASET:
      return { ...state, datasetId: action.datasetId };
    case RECEIVE_DATASETS:
      if (action.datasets.length > 0) {
        return { ...state, datasetId: action.datasets[0].datasetId }
      }
      return state;
    default:
      return state;
  }
}

function project(state = {
  isFetching: false,
  loaded: false,
  properties: {}
}, action) {
  switch (action.type) {
    case LOAD:
      return { ...action.payload.project, loaded: true };
    case REQUEST_PROJECT:
      return { ...state, isFetching: true };
    case RECEIVE_PROJECT:
      return { ...state, isFetching: false, properties: action.projectProperties };
    case CREATE_PROJECT:
      return { ...state, isFetching: true };
    case CREATED_PROJECT:
      return { ...state, isFetching: false, properties: action.projectProperties };
    default:
      return state;
  }
}

function user(state = {
  isFetching: false,
  loaded: false,
  properties: {}
}, action) {
  switch (action.type) {
    case LOAD:
      return { ...action.payload.user, loaded: true };
    case CREATE_ANONYMOUS_USER:
      return { ...state, properties: action.userProperties }
    default:
      return state;
  }
}

function specs(state={
  isFetching: false,
  loaded: false,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_SPECS:
      return { ...state, isFetching: true };
    case RECEIVE_SPECS:
      return { ...state, isFetching: false, items: action.specs };
    default:
      return state;
  }
}

function filters(state={
  visualizationTypes: [
    {
      type: "TREEMAP",
      imageName: "treemap",
      label: "Treemap",
      selected: false,
      disabled: false
    },
    {
      type: "BAR",
      imageName: "bar",
      label: "Bar",
      selected: false,
      disabled: false
    },
    {
      type: "PIE",
      imageName: "pie",
      label: "Pie",
      selected: false,
      disabled: false
    },
    {
      type: "LINE",
      imageName: "line",
      label: "Line",
      selected: false,
      disabled: false
    },
    {
      type: "SCATTERPLOT",
      imageName: "scatterplot",
      label: "Scatter",
      selected: false,
      disabled: false
    }
  ]
}, action) {
  switch(action.type){
    case SELECT_VISUALIZATION_TYPE:
      var newVisualizationTypes = state.visualizationTypes;

      const previousSelectedIndex = state.visualizationTypes.findIndex((typeObject, i, types) =>
        typeObject.selected
      );
      if (previousSelectedIndex >= 0) {
        newVisualizationTypes[previousSelectedIndex].selected = false;
      }

      const newSelectedIndex = state.visualizationTypes.findIndex((typeObject, i, types) =>
        typeObject.type == action.selectedType
      );
      if (newSelectedIndex >= 0) {
        newVisualizationTypes[newSelectedIndex].selected = true;
      }
      return { ...state, visualizationTypes: newVisualizationTypes }
    default:
      return state;
  }
}

function visualization(state = {
  tableData: [],
  visualizationData: [],
  spec: {},
  isFetching: false
}, action) {
  switch (action.type) {
    case REQUEST_VISUALIZATION_DATA:
      return { ...state, isFetching: true }
    case RECEIVE_VISUALIZATION_DATA:
      return { ...state, spec: action.spec, tableData: action.tableData, visualizationData: action.visualizationData, isFetching: false }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  datasets,
  filters,
  project,
  specs,
  specSelector,
  user,
  visualization,
  router
});

export default rootReducer;
