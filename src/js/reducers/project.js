import {
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  CREATE_PROJECT,
  CREATED_PROJECT,
  UPDATED_PROJECT,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  isFetching: false,
  loaded: false
};

export default function project(state = baseState, action) {
  switch (action.type) {
    case REQUEST_PROJECT:
      return { ...state, isFetching: true, id: action.projectId };

    case RECEIVE_PROJECT:
      return { ...state, isFetching: false, ...action.projectProperties };

    case CREATE_PROJECT:
      return { ...state, isFetching: true };

    case CREATED_PROJECT:
      return { ...state, isFetching: false, ...action.projectProperties };

    case UPDATED_PROJECT:
      return { ...state, ...action.projectProperties };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
