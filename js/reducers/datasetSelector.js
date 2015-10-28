import {
  SELECT_DATASET,
  RECEIVE_UPLOAD_DATASET,
  RECEIVE_DATASETS,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  datasetId: null,
  loaded: false
}

export default function datasetSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_DATASET:
      return { ...state, datasetId: action.datasetId };
    case RECEIVE_UPLOAD_DATASET:
      return { ...state, datasetId: action.datasets[0].datasetId, loaded: true };
    case RECEIVE_DATASETS:
      if (action.datasets.length > 0) {
        return { ...state, datasetId: action.datasets[0].datasetId, loaded: true }
      }
      return { ...state, loaded: true };
    case WIPE_PROJECT_STATE:
      return baseState;
    default:
      return state;
  }
}
