import {
  CREATE_ANONYMOUS_USER,
  SET_USER_EMAIL,
  SUBMIT_USER,
  USER_LOGGED_IN,
  USER_LOGGED_OUT
} from '../constants/ActionTypes';

const baseState = {
  isAuthenticated: false,
  properties: {}
}

export default function user(state = baseState, action) {
  switch (action.type) {
    case CREATE_ANONYMOUS_USER:
      return { ...state, properties: action.userProperties };
    case SET_USER_EMAIL:
      return { ...state, properties: { ...state.properties, email: action.email } };
    case SUBMIT_USER:
      return { ...state, properties: { ...state.properties, submitted: true } };
    case USER_LOGGED_IN:
      return { ...state };
    case USER_LOGGED_OUT:
      return baseState;
    default:
      return baseState;
  }
}
