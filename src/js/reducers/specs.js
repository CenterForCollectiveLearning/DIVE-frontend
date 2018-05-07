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
  SET_EXPLORE_QUERY_STRING,
  SELECT_DATASET,
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

import { SORT_ORDERS } from './visualization';

export default function specs(state=baseState, action) {
  switch (action.type) {
    case RECEIVE_EXACT_SPECS:
    case RECEIVE_INDIVIDUAL_SPECS:
    case RECEIVE_SUBSET_SPECS:
    case RECEIVE_EXPANDED_SPECS:
      var newSpecs = [ ...state.items, ...action.specs ];
      var newSpecsWithSortFields = newSpecs.map((spec) => {
        const headers = spec.data.visualize[0].filter((header) =>
          (typeof header === 'string' || header instanceof String)
        );

        const SORT_FIELDS = headers.map((field, index) => {
          var selected = false;
          if (index == 0)
            selected = true;
          return new Object({
            id: index,
            name: field,
            selected: selected
          })
        });

        return new Object({
          ...spec,
          sortFields: SORT_FIELDS,
          sortOrders: SORT_ORDERS
        })
      })
      return { ...state, isFetching: false, items: newSpecsWithSortFields, recommendationLevel: action.recommendationType.level, updatedAt: action.receivedAt, loaded: true, progress: null, error: null };

    case FAILED_RECEIVE_SPECS:
      return { ...state, isFetching: false, loaded: true, error: action.error };

    case SET_EXPLORE_QUERY_STRING:
      if (action.resetState) {
        return baseState;
      } else {
        return state;
      }

    case SELECT_DATASET:
    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
