import {
  REQUEST_SPECS,
  PROGRESS_SPECS,
  RECEIVE_SPECS,
  FAILED_RECEIVE_SPECS,
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

export default function specs(state=baseState, action) {
  switch (action.type) {
    case REQUEST_SPECS:
      return { ...state, isFetching: true, progress: null, error: null };

    case PROGRESS_SPECS:
      if (action.progress && action.progress.length){
        return { ...state, progress: action.progress };
      }
      return state;

    case RECEIVE_SPECS:
      return { ...state, isFetching: false, items: action.specs, updatedAt: action.receivedAt, loaded: true, progress: null, error: null };

    case FAILED_RECEIVE_SPECS:
      return { ...state, isFetching: false, loaded: true, error: action.error };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
