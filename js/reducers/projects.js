import { LOAD } from 'redux-storage';

import {
  REQUEST_PRELOADED_PROJECTS,
  RECEIVE_PRELOADED_PROJECTS,
  RECEIVE_PROJECTS
} from '../constants/ActionTypes';

export default function projects(state = {
  isFetching: false,
  loaded: false,
  preloadedProjects: [],
  userProjects: []
}, action) {
  switch (action.type) {
    case LOAD:
      // return { ...action.payload.projects, loaded: true };
      return state;
    case REQUEST_PRELOADED_PROJECTS:
      return { ...state, isFetching: true };
    case RECEIVE_PRELOADED_PROJECTS:
      return { ...state, isFetching: false, preloadedProjects: action.projects };
    case RECEIVE_PROJECTS:
      return { ...state, isFetching: false, userProjects: action.projects.filter((project) => !project.preloaded) };
    default:
      return state;
  }
}
