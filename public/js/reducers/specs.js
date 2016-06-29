import {
  REQUEST_SPECS,
  PROGRESS_SPECS,
  RECEIVE_SPECS,
  FAILED_RECEIVE_SPECS,
  SELECT_FIELD_PROPERTY,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  isFetching: false,
  recommendationLevel: null,
  loaded: false,
  items: [],
  updatedAt: 0,
  progress: null,
  error: null
}

export default function specs(state=baseState, action) {
  switch (action.type) {
    case REQUEST_SPECS:
      return { ...state, loaded: false, isFetching: true, progress: null, error: null };

    case PROGRESS_SPECS:
      if (action.progress && action.progress.length){
        return { ...state, loaded: false, progress: action.progress };
      }
      return state;

    case RECEIVE_SPECS:
      var allSpecs = action.specs;
      if (action.recommendationType.level && state.items) {
        allSpecs = [ ...state.items, ...allSpecs ];
      }
      return { ...state, isFetching: false, items: allSpecs, recommendationLevel: action.recommendationType.level, updatedAt: action.receivedAt, loaded: true, progress: null, error: null };

    case FAILED_RECEIVE_SPECS:
      return { ...state, isFetching: false, loaded: true, error: action.error };

    case SELECT_FIELD_PROPERTY:
      return baseState;

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
