import {
  SELECT_DATASET,
  REQUEST_UPLOAD_DATASET,
  PROGRESS_UPLOAD_DATASET,
  RECEIVE_UPLOAD_DATASET,
  RECEIVE_DATASET,
  RECEIVE_DATASETS,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  datasetId: null,
  title: null,
  loaded: false,
  isUploading: false,
  uploadError: null,
  progress: null,
  projectId: null
}

export default function datasetSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_DATASET:
      return { ...state, datasetId: action.datasetId, projectId: action.projectId };

    case REQUEST_UPLOAD_DATASET:
      return { ...state, isUploading: true };

    case PROGRESS_UPLOAD_DATASET:
      return { ...state, progress: action.progress };

    case RECEIVE_UPLOAD_DATASET:
      if (action.error) {
        return { ...state, loaded: true, isUploading: false, uploadError: action.error };
      }
      return { ...state, datasetId: action.datasets[0].datasetId, title: action.datasets[0].title, loaded: true, isUploading: false, uploadError: null, projectId: action.projectId };

    case RECEIVE_DATASET:
      return { ...state, datasetId: action.datasetId, title: action.title, loaded: true, progress: null, projectId: action.projectId };

    case RECEIVE_DATASETS:
      if (action.datasets.length > 0 && action.setSelector) {
        return { ...state, datasetId: state.datasetId || action.datasets[0].datasetId, title: state.title || action.datasets[0].title, loaded: true, projectId: action.projectId };
      }
      return { ...state, loaded: true, projectId: action.projectId };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
