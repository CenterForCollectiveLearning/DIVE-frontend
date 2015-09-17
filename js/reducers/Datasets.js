import { combineReducers } from 'redux';

import {
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  REQUEST_DATASETS,
  RECEIVE_DATASETS
} from '../constants/ActionTypes';

function datasets(state = {
  isFetching: false,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_DATASETS:
      return { ...state, isFetching: true };
    case RECEIVE_DATASETS:
      return { ...state, isFetching: false, items: action.datasets };
    default:
      return state;
  }
}

function project(state = {
  isFetching: false,
  properties: {}
}, action) {
  switch (action.type) {
    case REQUEST_PROJECT:
      return { ...state, isFetching: true };
    case RECEIVE_PROJECT:
      return { ...state, isFetching: false, properties: action.projectProperties };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  datasets,
  project
});

export default rootReducer;
