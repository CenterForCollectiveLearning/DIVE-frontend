import {
  REQUEST_EXPORTED_VISUALIZATION_SPECS,
  RECEIVE_EXPORTED_VISUALIZATION_SPECS,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  isFetching: false,
  loaded: false,
  items: [],
  updatedAt: 0,
  progress: null,
  error: null
}

export default function exportedSpecs(state=baseState, action) {
  switch (action.type) {
    case REQUEST_EXPORTED_VISUALIZATION_SPECS:
      return { ...state, isFetching: true, progress: null, error: null };

    case RECEIVE_EXPORTED_VISUALIZATION_SPECS:
      return { ...state, isFetching: false, items: action.specs, updatedAt: action.receivedAt, loaded: true, progress: null, error: null };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
