import {
  REQUEST_LOGIN_USER,
  RECEIVE_LOGIN_USER,
  ERROR_LOGIN_USER,
  REQUEST_REGISTER_USER,
  RECEIVE_REGISTER_USER,
  ERROR_REGISTER_USER,
  REQUEST_LOGOUT_USER,
  RECEIVE_LOGOUT_USER,
  ERROR_LOGOUT_USER,
  REQUEST_CONFIRM_TOKEN,
  RECEIVE_CONFIRM_TOKEN,
  ERROR_CONFIRM_TOKEN
} from '../constants/ActionTypes';

import cookie from 'react-cookie';

const baseError = {
  login: '',
  logout: '',
  register: {
    email: null,
    username: null
  }
};

const baseState = {
  rememberToken: cookie.load('remember_token') || null,
  isAuthenticated: cookie.load('remember_token') ? true : false,
  username: cookie.load('username') || '',
  email: cookie.load('email') || '',
  id: cookie.load('user_id') || '',
  error: baseError,
  success: {
    login: '',
    logout: '',
    register: ''
  },
  token: {
    error: null,
    isConfirming: false,
    confirmed: false,
    message: '',
    alreadyActivated: false
  },
  properties: {},
};

export default function user(state = baseState, action) {
  switch (action.type) {
    case REQUEST_LOGIN_USER:
      return { ...state, error: baseError };

    case REQUEST_CONFIRM_TOKEN:
      return { ...state, token: { ...state.token, isConfirming: true }};

    case RECEIVE_CONFIRM_TOKEN:
      return { ...state,
        // success: { login: action.message, register: ''},
        // isAuthenticated: true,
        username: action.username,
        email: action.email,
        id: action.id,
        alreadyActivated: action.alreadyActivated,
        token: { ...state.token, isConfirming: false, confirmed: true, message: action.message
      }};

    case RECEIVE_LOGIN_USER:
      return { ...state,
        success: { login: action.message, register: '' },
        isAuthenticated: true,
        username: action.username,
        email: action.email,
        id: action.id
      };

    case ERROR_CONFIRM_TOKEN:
      console.error('Error confirming token', action.error);
      return { ...state, token: { ...state.token, error: true, message: action.error }}

    case ERROR_LOGIN_USER:
      console.error('Error logging in', action, action.error)
      return { ...state, error: { ...state.error, login: action.error }};

    case RECEIVE_REGISTER_USER:
      return { ...state,
        success: { register: action.message, login: ''},
        isAuthenticated: true,
        username: action.username,
        email: action.email,
        id: action.id
      };
    case ERROR_REGISTER_USER:
      return { ...state,
        error: {
          ...state.error,
          register: {
            ...state.error.register,
            email: action.emailError,
            username: action.usernameError,
          }
      }};
    case RECEIVE_LOGOUT_USER:
      return {
        ...baseState,
        rememberToken: null,
        username: '',
        email: '',
        id: '',
        isAuthenticated: false
      };
    default:
      return state;
  }
}
