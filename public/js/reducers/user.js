import {
  CREATE_ANONYMOUS_USER,
  SET_USER_EMAIL,
  SUBMIT_USER,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  RECEIVE_LOGIN_USER,
  ERROR_LOGIN_USER
} from '../constants/ActionTypes';

const baseState = {
  isAuthenticated: false,
  error: {
    login: '',
    register: ''
  },
  success: {
    login: '',
    register: ''
  },
  properties: {},
  id: null,
}

export default function user(state = baseState, action) {
  switch (action.type) {
    case CREATE_ANONYMOUS_USER:
      return { ...state, properties: action.userProperties };
    case SET_USER_EMAIL:
      return { ...state, properties: { ...state.properties, email: action.email } };
    case SUBMIT_USER:
      return { ...state, properties: { ...state.properties, submitted: true } };
    case RECEIVE_LOGIN_USER:
      return { ...state, isAuthenticated: true };
    case ERROR_LOGIN_USER:
      return { ...state, error: { login: action.message }};
    case USER_LOGGED_OUT:
      return baseState;
    default:
      return baseState;
  }
}
