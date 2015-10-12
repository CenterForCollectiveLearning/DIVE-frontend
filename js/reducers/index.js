import { combineReducers } from 'redux';
import {routerStateReducer as router} from 'redux-react-router';
import { LOAD, SAVE } from 'redux-storage';

import {
  CREATE_ANONYMOUS_USER,
  CREATE_PROJECT,
  CREATED_PROJECT,
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  REQUEST_PRELOADED_PROJECTS,
  RECEIVE_PRELOADED_PROJECTS,
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  RECEIVE_UPLOAD_DATASET,
  RECEIVE_DATASET,
  SELECT_FIELD_PROPERTY,
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES,
  SELECT_AGGREGATION_FUNCTION,
  REQUEST_SPECS,
  RECEIVE_SPECS,
  SELECT_DATASET,
  SELECT_VISUALIZATION_TYPE,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA,
  CLEAR_VISUALIZATION
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
      var mergedDatasetLists = mergeDatasetLists(state.items, action.datasets);
      return { ...state, isFetching: false, items: mergedDatasetLists, datasetId: mergedDatasetLists[0].datasetId};
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

function projects(state = {
  isFetching: false,
  loaded: false,
  items: []
}, action) {
  switch (action.type) {
    case LOAD:
      return { ...action.payload.projects, loaded: true };
    case REQUEST_PRELOADED_PROJECTS:
      return { ...state, isFetching: true };
    case RECEIVE_PRELOADED_PROJECTS:
      return { ...state, isFetching: false, items: action.projects };
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

function fieldProperties(state={
  isFetching: false,
  loaded: false,
  items: [],
  selectedItems: []
}, action) {
  const AGGREGATIONS = [
    {
      value: "AVG",
      label: "mean",
      selected: false
    },
    {
      value: "MIN",
      label: "min",
      selected: false
    },
    {
      value: "MAX",
      label: "max",
      selected: false
    }
  ];
  switch (action.type) {
    case SELECT_FIELD_PROPERTY:
      var { items, selectedItems } = state;

      const itemIndex = state.items.findIndex((property, i, props) =>
        property.id == action.selectedFieldPropertyId
      );

      if (itemIndex >= 0) {
        // Toggling in items list
        items[itemIndex].selected = !items[itemIndex].selected;

        // Adding or removing from selectedItems list
        const selectedItemsItemIndex = state.selectedItems.findIndex((property, i, props) =>
          property.id == action.selectedFieldPropertyId
        );

        if (selectedItemsItemIndex >= 0) {
          selectedItems.splice(selectedItemsItemIndex, 1);
        }
        else {
          const item = items[itemIndex];
          selectedItems.push({
            id: item.id,
            name: item.name
          });
        }
      }

      return { ...state, items: items, selectedItems: selectedItems };
    case SELECT_AGGREGATION_FUNCTION:
      var { items, selectedItems } = state;

      const selectedAggregationFunctionFieldPropertyIndex = state.items.findIndex((property, i, props) =>
        property.id == action.selectedAggregationFunctionFieldPropertyId
      );

      if (selectedAggregationFunctionFieldPropertyIndex >= 0) {
        const selectedAggregationIndex = items[selectedAggregationFunctionFieldPropertyIndex].splitMenu.findIndex((aggregation, j, aggregations) =>
          aggregation.value == action.selectedAggregationFunction
        );

        var aggregations = AGGREGATIONS.slice();
        aggregations[selectedAggregationIndex].selected = true;

        if (selectedAggregationIndex >= 0) {
          items[selectedAggregationFunctionFieldPropertyIndex].splitMenu = aggregations;
        }

        // Adding in sele
        const aggregationValue = aggregations[selectedAggregationIndex].value;
        const selectedItemsItemIndex = state.selectedItems.findIndex((property, i, props) =>
          property.id == action.selectedAggregationFunctionFieldPropertyId
        );
        selectedItems[selectedItemsItemIndex].aggregation = aggregationValue;
      }

      return { ...state, items: items, selectedItems: selectedItems };
    case REQUEST_FIELD_PROPERTIES:
      return { ...state, isFetching: true };
    case RECEIVE_FIELD_PROPERTIES:
      var aggregations = AGGREGATIONS.slice();
      aggregations[0].selected = true;

      var items = [ ...action.fieldProperties.c, ...action.fieldProperties.q ].map((property) =>
        new Object({
          ...property,
          selected: false,
          splitMenu: (property.generalType == 'q') ? aggregations : []
        })
      );
      return { ...state, isFetching: false, items: items };
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
    case CLEAR_VISUALIZATION:
      return {
        tableData: [],
        visualizationData: [],
        spec: {},
        isFetching: false
      }
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
  projects,
  fieldProperties,
  specs,
  specSelector,
  user,
  visualization,
  router
});

export default rootReducer;
