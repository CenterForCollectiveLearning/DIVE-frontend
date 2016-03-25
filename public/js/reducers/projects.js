import {
  REQUEST_PRELOADED_PROJECTS,
  REQUEST_USER_PROJECTS,
  RECEIVE_PRELOADED_PROJECTS,
  RECEIVE_USER_PROJECTS
} from '../constants/ActionTypes';

export default function projects(state = {
  isFetchingPreloadedProjects: false,
  isFetchingUserProjects: false,
  preloadedProjectsLoaded: false,
  userProjectsLoaded: false,
  preloadedProjects: [],
  userProjects: []
}, action) {
  switch (action.type) {
    case REQUEST_PRELOADED_PROJECTS:
      return { ...state, isFetchingPreloadedProjects: true };

    case REQUEST_USER_PROJECTS:
      return { ...state, isFetchingUserProjects: true };

    case RECEIVE_PRELOADED_PROJECTS:
      return { ...state, isFetchingPreloadedProjects: false, preloadedProjects: action.projects, preloadedProjectsLoaded: true };

    case RECEIVE_USER_PROJECTS:
      return { ...state, isFetchingUserProjects: false, userProjects: action.projects.filter((project) => !project.preloaded), userProjectsLoaded: true };

    default:
      return state;
  }
}
