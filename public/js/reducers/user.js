import {
  REQUEST_LOGIN_USER,
  RECEIVE_LOGIN_USER,
  ERROR_LOGIN_USER,
  REQUEST_LOGOUT_USER,
  RECEIVE_LOGOUT_USER,
  ERROR_LOGOUT_USER,
} from '../constants/ActionTypes';

function getCookieValue(a, b) {
    b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

// Rehydrated state
const rehydratedState = {
  rememberToken: getCookieValue('remember_token') || null,
  isAuthenticated: getCookieValue('remember_token') ? true : false,
  loggedOut: false,
  error: {
    login: '',
    logout: '',
    register: ''
  },
  success: {
    login: '',
    logout: '',
    register: ''
  },
  username: '',
  email: '',
  properties: {},
  id: null,
}

const baseState = {
  rememberToken: null,
  isAuthenticated: false,
  loggedOut: false,
  error: {
    login: '',
    logout: '',
    register: ''
  },
  success: {
    login: '',
    logout: '',
    register: ''
  },
  username: '',
  email: '',
  properties: {},
  id: null,
}

export default function user(state = baseState, action) {
  switch (action.type) {
    case RECEIVE_LOGIN_USER:
      return { ...state,
        loggedOut: false,
        success: { login: action.message, register: '' },
        isAuthenticated: true,
        username: action.username,
        email: action.email
      };
    case ERROR_LOGIN_USER:
      return { ...state, error: { login: action.message }};
    case RECEIVE_LOGOUT_USER:
      return { ...baseState, loggedOut: true };
    default:
      return state;
  }
}
