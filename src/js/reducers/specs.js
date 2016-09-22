import {
  REQUEST_EXACT_SPECS,
  REQUEST_INDIVIDUAL_SPECS,
  REQUEST_SUBSET_SPECS,
  REQUEST_EXPANDED_SPECS,
  PROGRESS_EXACT_SPECS,
  PROGRESS_INDIVIDUAL_SPECS,
  PROGRESS_SUBSET_SPECS,
  PROGRESS_EXPANDED_SPECS,
  RECEIVE_EXACT_SPECS,
  RECEIVE_INDIVIDUAL_SPECS,
  RECEIVE_SUBSET_SPECS,
  RECEIVE_EXPANDED_SPECS,
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
    case RECEIVE_EXACT_SPECS:
    case RECEIVE_INDIVIDUAL_SPECS:
    case RECEIVE_SUBSET_SPECS:
    case RECEIVE_EXPANDED_SPECS:
      var newSpecs = [ ...state.items, ...action.specs ];
      return { ...state, isFetching: false, items: newSpecs, recommendationLevel: action.recommendationType.level, updatedAt: action.receivedAt, loaded: true, progress: null, error: null };

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
