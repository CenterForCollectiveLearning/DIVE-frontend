import {
  SELECT_DATASET,
  DELETED_DATASET,
  REQUEST_UPLOAD_DATASET,
  PROGRESS_UPLOAD_DATASET,
  ERROR_UPLOAD_DATASET,
  RECEIVE_UPLOAD_DATASET,
  RECEIVE_DATASET,
  RECEIVE_DATASETS,
  RECEIVE_SELECT_PRELOADED_DATASET,
  RECEIVE_DESELECT_PRELOADED_DATASET,
  SELECT_DATASET_LAYOUT_TYPE,
  SET_DATASET_INSPECT_QUERY_STRING,
  SET_DATASET_TRANSFORM_QUERY_STRING,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const layoutTypes = [
  {
    id: 'list',
    label: 'List',
  },
  {
    id: 'table',
    label: 'Table',
  }
]

const baseState = {
  layoutTypes: layoutTypes,
  datasetId: null,
  title: null,
  loaded: false,
  error: null,
  projectId: null,
  inspectQueryString: null,
  transformQueryString: null
}

export default function datasetSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_DATASET:
      return { ...state, datasetId: action.datasetId, projectId: action.projectId };

    case DELETED_DATASET:
      return { ...state, datasetId: null };

    case REQUEST_UPLOAD_DATASET:
      return { ...state, isUploading: true };

    case PROGRESS_UPLOAD_DATASET:
      return { ...state, progress: action.progress };

    case ERROR_UPLOAD_DATASET:
      return { ...state, progress: null, error: action.error };

    case RECEIVE_UPLOAD_DATASET:
      if (action.error) {
        return { ...state, loaded: true, isUploading: false, error: action.error };
      }
      return { ...state, datasetId: action.datasets[0].datasetId, title: action.datasets[0].title, loaded: true, isUploading: false, error: null, projectId: action.projectId };

    case RECEIVE_SELECT_PRELOADED_DATASET:
      return { ...state, isFetching: false, datasetId: action.preloadedDataset.id, title: action.preloadedDataset.title, loaded: true, projectId: action.projectId };

    case RECEIVE_DATASET:
      return { ...state, datasetId: action.datasetId, title: action.title, loaded: true, progress: null, projectId: action.projectId };

    case RECEIVE_DATASETS:
      if (action.datasets.length > 0 && action.setSelector) {
        return { ...state, datasetId: state.datasetId || action.datasets[0].datasetId, title: state.title || action.datasets[0].title, loaded: true, projectId: action.projectId };
      }
      return { ...state, loaded: true, projectId: action.projectId };

    case SET_DATASET_INSPECT_QUERY_STRING:
      return {
        ...state, inspectQueryString: action.queryString
      }

    case SET_DATASET_TRANSFORM_QUERY_STRING:
      return {
        ...state, transformQueryString: action.queryString
      }

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
