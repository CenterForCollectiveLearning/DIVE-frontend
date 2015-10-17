import {
  LOAD,
  CREATE_ANONYMOUS_USER
} from '../constants/ActionTypes';

export default function user(state = {
  isFetching: false,
  loaded: false,
  properties: {}
}, action) {
  switch (action.type) {
    case LOAD:
      return { ...action.payload.user, loaded: true };
    case CREATE_ANONYMOUS_USER:
      return { ...state, properties: action.userProperties }
    default:
      return state;
  }
}
