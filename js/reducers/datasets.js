import {
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  RECEIVE_UPLOAD_DATASET,
  RECEIVE_DATASET
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

export default function datasets(state = {
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
