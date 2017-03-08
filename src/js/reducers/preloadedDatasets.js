import {
  REQUEST_PRELOADED_DATASETS,
  RECEIVE_PRELOADED_DATASETS,
  REQUEST_SELECT_PRELOADED_DATASET,
  RECEIVE_SELECT_PRELOADED_DATASET,
  REQUEST_DESELECT_PRELOADED_DATASET,
  RECEIVE_DESELECT_PRELOADED_DATASET,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  isFetching: false,
  loaded: false,
  items: [],
}

export default function preloadedDatasets(state = baseState, action) {
  switch (action.type) {
    case REQUEST_PRELOADED_DATASETS:
      return { ...state, isFetching: true };

    case RECEIVE_PRELOADED_DATASETS:
      return { ...state, isFetching: false, items: action.datasets, loaded: true, fetchedAll: true };

    case RECEIVE_SELECT_PRELOADED_DATASET:
      var newDatasets = state.items.map((d) =>
        new Object({
          ...d,
          selected: (d.id == action.preloadedDataset.id) ? true : d.selected
        })
      )
      return { ...state, items: newDatasets };

    case RECEIVE_DESELECT_PRELOADED_DATASET:
      var newDatasets = state.items.map((d) =>
        new Object({
          ...d,
          selected: (d.id == action.preloadedDataset.id) ? false : d.selected
        })
      )
      return { ...state, items: newDatasets };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
