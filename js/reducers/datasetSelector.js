import {
  SELECT_DATASET,
  RECEIVE_UPLOAD_DATASET,
  RECEIVE_DATASETS
} from '../constants/ActionTypes';

export default function datasetSelector(state = {
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
