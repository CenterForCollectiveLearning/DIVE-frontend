import {
  REQUEST_EXPORTED_AGGREGATIONS,
  RECEIVE_EXPORTED_AGGREGATIONS,
  RECEIVE_CREATED_EXPORTED_AGGREGATION,
  RECEIVE_CREATED_SAVED_AGGREGATION,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  isFetching: false,
  loaded: false,
  items: [],
  updatedAt: 0
}

export default function exportedAggregations(state=baseState, action) {
  switch (action.type) {
    case REQUEST_EXPORTED_AGGREGATIONS:
      return { ...state, isFetching: true, loaded: false };

    case RECEIVE_EXPORTED_AGGREGATIONS:
      return { ...state, isFetching: false, items: action.items, updatedAt: action.receivedAt, loaded: true };

    case RECEIVE_CREATED_EXPORTED_AGGREGATION, RECEIVE_CREATED_SAVED_AGGREGATION:
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
