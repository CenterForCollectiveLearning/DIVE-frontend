import {
  REQUEST_EXPORTED_REGRESSIONS,
  RECEIVE_EXPORTED_REGRESSIONS,
  RECEIVE_CREATED_EXPORTED_REGRESSION,
  RECEIVE_CREATED_SAVED_REGRESSION,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  isFetching: false,
  loaded: false,
  items: [],
  updatedAt: 0
}

export default function exportedRegressions(state=baseState, action) {
  switch (action.type) {
    case REQUEST_EXPORTED_REGRESSIONS:
      return { ...state, isFetching: true, loaded: false };

    case RECEIVE_EXPORTED_REGRESSIONS:
      return { ...state, isFetching: false, items: action.regressions, updatedAt: action.receivedAt, loaded: true };

    case RECEIVE_CREATED_EXPORTED_REGRESSION, RECEIVE_CREATED_SAVED_REGRESSION:
      var updatedSpecs = state.items.slice();

      if (!updatedSpecs.find((spec) => spec.id == action.specId)) {
        updatedSpecs.push(action.exportedSpec);
      }

      return { ...state, isFetching: false, items: updatedSpecs, updatedAt: action.receivedAt }

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
