import {
  REQUEST_SPECS,
  RECEIVE_SPECS,
  FAILED_RECEIVE_SPECS,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  isFetching: false,
  loaded: false,
  items: [],
  updatedAt: 0
}

export default function specs(state=baseState, action) {
  switch (action.type) {
    case REQUEST_SPECS:
      return { ...state, isFetching: true };
    case RECEIVE_SPECS:
      return { ...state, isFetching: false, items: action.specs, updatedAt: action.receivedAt, loaded: true };
    case FAILED_RECEIVE_SPECS:
      return { ...state, isFetching: false, loaded: true };
    case WIPE_PROJECT_STATE:
      return baseState;
    default:
      return state;
  }
}
