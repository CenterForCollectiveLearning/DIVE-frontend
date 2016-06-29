import {
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  CREATE_PROJECT,
  CREATED_PROJECT
} from '../constants/ActionTypes';

export default function project(state = {
  isFetching: false,
  loaded: false,
  properties: {}
}, action) {
  switch (action.type) {
    case REQUEST_PROJECT:
      return { ...state, isFetching: true, properties: { id: action.projectId } };

    case RECEIVE_PROJECT:
      return { ...state, isFetching: false, properties: action.projectProperties };

    case CREATE_PROJECT:
      return { ...state, isFetching: true };

    case CREATED_PROJECT:
      return { ...state, isFetching: false, properties: action.projectProperties };

    default:
      return state;
  }
}
