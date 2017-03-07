import {
  REQUEST_PRELOADED_DATASETS,
  RECEIVE_PRELOADED_DATASETS,
  SELECT_PRELOADED_DATASET,
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

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
