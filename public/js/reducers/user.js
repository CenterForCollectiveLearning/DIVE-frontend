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
} from '../constants/ActionTypes';

import cookie from 'react-cookie';

console.log('Remember Token:', cookie.load('remember_token'));
console.log('Username:', cookie.load('username'));
console.log('Email:', cookie.load('email'));

const baseState = {
  rememberToken: cookie.load('remember_token') || null,
  isAuthenticated: cookie.load('remember_token') ? true : false,
  username: cookie.load('username') || '',
  email: cookie.load('email') || '',
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
  properties: {},
  id: null,
}

export default function user(state = baseState, action) {
  switch (action.type) {
    case RECEIVE_LOGIN_USER:
      return { ...state,
        success: { login: action.message, register: '' },
        isAuthenticated: true,
        username: action.username,
        email: action.email
      };
    case ERROR_LOGIN_USER:
      return { ...state, error: { login: action.message }};
    case RECEIVE_REGISTER_USER:
      return { ...state,
        success: { register: action.message, login: ''},
        isAuthenticated: true,
        username: action.username,
        email: action.email
      };
    case ERROR_REGISTER_USER:
      return { ...state, error: { register: action.message }};
    case RECEIVE_LOGOUT_USER:
      return {
        ...baseState,
        rememberToken: null,
        username: '',
        email: '',
        isAuthenticated: false
      };
    default:
      return state;
  }
}
