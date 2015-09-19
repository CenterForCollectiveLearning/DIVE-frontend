import { combineReducers } from 'redux';
import {routerStateReducer as router} from 'redux-react-router';

import {
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  RECEIVE_UPLOAD_DATASET
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
    case RECEIVE_UPLOAD_DATASET:
      return { ...state, isFetching: false, items: [...state.items, action.dataset] };
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
  project,
  router
});

export default rootReducer;
