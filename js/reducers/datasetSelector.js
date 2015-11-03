import {
  SELECT_DATASET,
  REQUEST_UPLOAD_DATASET,
  RECEIVE_UPLOAD_DATASET,
  RECEIVE_DATASETS,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  datasetId: null,
  loaded: false,
  isUploading: false
}

export default function datasetSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_DATASET:
      return { ...state, datasetId: action.datasetId };
    case REQUEST_UPLOAD_DATASET:
      return { ...state, isUploading: true };
    case RECEIVE_UPLOAD_DATASET:
      return { ...state, datasetId: action.datasets[0].datasetId, loaded: true, isUploading: false };
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
