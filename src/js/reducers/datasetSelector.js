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
    id: 'table',
    // label: 'Table',
    iconName: 'th',
    ptIcon: true
  },
  {
    id: 'list',
    // label: 'List',
    iconName: 'list',
    ptIcon: true
  }
]

const baseState = {
  layoutTypes: layoutTypes,
  id: null,
  title: null,
  loaded: false,
  details: null,
  error: null,
  projectId: null,
  preloaded: false,
  inspectQueryString: null,
  transformQueryString: null
}

export default function datasetSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_DATASET:
      return { ...state, id: action.id, projectId: action.projectId };

    case DELETED_DATASET:
      return { ...state, id: null };

    case REQUEST_UPLOAD_DATASET:
      return { ...state, isUploading: true, error: null };

    case PROGRESS_UPLOAD_DATASET:
      return { ...state, progress: action.progress };

    case ERROR_UPLOAD_DATASET:
      return { ...state, progress: null, isUploading: false, error: action.error };

    case RECEIVE_UPLOAD_DATASET:
      if (action.error) {
        return { ...state, loaded: true, isUploading: false, error: action.error };
      }
      return { ...state, id: action.datasets[0].id, title: action.datasets[0].title, loaded: true, isUploading: false, error: null, projectId: action.projectId, details: action.details };

    case RECEIVE_SELECT_PRELOADED_DATASET:
      return { ...state, isFetching: false, id: action.preloadedDataset.id, title: action.preloadedDataset.title, loaded: true, projectId: action.projectId, details: action.nextDataset.details };

    case RECEIVE_DESELECT_PRELOADED_DATASET:
      if (state.id == action.preloadedDataset.id) {
        if (action.nextDataset) {
          return { ...state, id: action.nextDataset.id, title: action.nextDataset.title, details: action.nextDataset.details, preloaded: action.nextDataset.preloaded }
        } else {
          return { ...state, id: null };
        }
      } else {
        return state;
      }

    case RECEIVE_DATASET:
      return { ...state, id: action.id, title: action.title, preloaded: action.preloaded, details: action.details, loaded: true, progress: null, projectId: action.projectId };

    case RECEIVE_DATASETS:
      if (action.datasets.length > 0 && action.setSelector) {
        return { ...state, id: state.id || action.datasets[0].id, title: state.title || action.datasets[0].title, preloaded: action.datasets[0].preloaded, details: action.datasets[0].details, loaded: true, projectId: action.projectId };
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
