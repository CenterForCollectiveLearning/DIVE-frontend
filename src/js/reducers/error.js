import {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  REQUEST_TIMEOUT_ERROR,
  AUTH_ERROR,
  GENERAL_ERROR,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  type: null,
  status: null,
  statusText: '',
  response: null
}

export default function error(state=baseState, action) {
  switch(action.type){
    case BAD_REQUEST_ERROR:
    case NOT_FOUND_ERROR:
    case REQUEST_TIMEOUT_ERROR:
    case AUTH_ERROR:
    case GENERAL_ERROR:
      return {
        type: action.type,
        status: action.status,
        statusText: action.statusText,
        response: action.response
      };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
