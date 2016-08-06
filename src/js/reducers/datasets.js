import {
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  RECEIVE_UPLOAD_DATASET,
  RECEIVE_DATASET,
  WIPE_PROJECT_STATE
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

const baseState = {
  projectId: null,
  isFetching: false,
  loaded: false,
  fetchedAll: false,
  items: []
}

export default function datasets(state = baseState, action) {
  switch (action.type) {
    case REQUEST_DATASETS:
      return { ...state, isFetching: true, projectId: action.projectId };

    case RECEIVE_DATASETS:
      var mergedDatasetLists = mergeDatasetLists(state.items, action.datasets);
      return { ...state, isFetching: false, items: mergedDatasetLists, loaded: true, fetchedAll: true, projectId: action.projectId };        

    case RECEIVE_UPLOAD_DATASET:
      if (action.error) {
        return { ...state, isFetching: false, loaded: true };
      }
      return { ...state, isFetching: false, items: [...state.items, ...action.datasets], loaded: true, projectId: action.projectId };

    case RECEIVE_DATASET:
      const newDataset = [{
          datasetId: action.datasetId,
          title: action.title,
          data: action.data,
          details: action.details
      }];
      return { ...state, items: mergeDatasetLists(state.items, newDataset), projectId: action.projectId };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
