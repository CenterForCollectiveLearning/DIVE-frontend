import {
  LOAD,
  REQUEST_PRELOADED_PROJECTS,
  RECEIVE_PRELOADED_PROJECTS
} from '../constants/ActionTypes';

export default function projects(state = {
  isFetching: false,
  loaded: false,
  items: []
}, action) {
  switch (action.type) {
    case LOAD:
      return { ...action.payload.projects, loaded: true };
    case REQUEST_PRELOADED_PROJECTS:
      return { ...state, isFetching: true };
    case RECEIVE_PRELOADED_PROJECTS:
      return { ...state, isFetching: false, items: action.projects };
    default:
      return state;
  }
}
