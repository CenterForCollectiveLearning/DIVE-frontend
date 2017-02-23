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
  ERROR_CONFIRM_TOKEN,
  REQUEST_RESEND_EMAIL,
  RECEIVE_RESEND_EMAIL,
  ERROR_RESEND_EMAIL
} from '../constants/ActionTypes';

import cookie from 'react-cookie';

const baseState = {
  rememberToken: cookie.load('remember_token') || null,
  isAuthenticated: cookie.load('remember_token') ? true : false,
  username: cookie.load('username') || '',
  email: cookie.load('email') || '',
  id: cookie.load('user_id') || '',
  confirmed: (cookie.load('confirmed') == 'True') || false,
  login: {
    error: null,
    success: false,
  },
  register: {
    error: null,
    emailError: null,
    usernameError: null,
    success: false,
  },
  logout: {
    error: null,
    success: false,
  },
  token: {
    error: null,
    isConfirming: false,
    confirmed: false,
    message: '',
    alreadyActivated: false
  },
  resend: {
    error: null,
    isSending: false,
    sent: false
  }
};

export default function user(state = baseState, action) {
  switch (action.type) {
    case REQUEST_LOGIN_USER:
      return { ...state, login: baseState.login };

    case REQUEST_REGISTER_USER:
      return { ...state, register: baseState.register };

    case REQUEST_CONFIRM_TOKEN:
      return { ...state, token: { ...state.token, isConfirming: true }};

    case RECEIVE_CONFIRM_TOKEN:
      return { ...state,
        confirmed: true,
        username: action.username,
        email: action.email,
        id: action.id,
        token: {
          ...state.token,
          alreadyActivated: action.alreadyActivated,
          isConfirming: false,
          confirmed: true,
          message: action.message
      }};

    case RECEIVE_LOGIN_USER:
      return { ...state,
        success: { login: action.message, register: '' },
        confirmed: action.confirmed,
        isAuthenticated: true,
        username: action.username,
        email: action.email,
        id: action.id
      };

    case ERROR_CONFIRM_TOKEN:
      console.error('Error confirming token', action.error);
      return { ...state,
        token: { ...state.token,
          isConfirming: false,
          error: action.error
        }
      };

    case ERROR_LOGIN_USER:
      return { ...state,
        login: {
          error: action.error,
          success: false
        }
      };

    case RECEIVE_REGISTER_USER:
      return { ...state,
        register: { ...baseState.success, success: action.message },
        isAuthenticated: true,
        confirmed: false,
        username: action.username,
        email: action.email,
        id: action.id
      };

    case ERROR_REGISTER_USER:
      return { ...state,
        register: {
          success: false,
          emailError: action.emailError,
          usernameError: action.usernameError
        }
      };

    case RECEIVE_LOGOUT_USER:
      return {
        ...baseState,
        rememberToken: null,
        username: '',
        email: '',
        id: '',
        isAuthenticated: false
      };

    case REQUEST_RESEND_EMAIL:
      return { ...state, resend: { ...state.resend, isSending: true }};

    case RECEIVE_RESEND_EMAIL:
      return { ...state, resend: { ...state.resend, isSending: false, sent: true }};

    case ERROR_RESEND_EMAIL:
      return { ...state, resend: { ...state.resend, error: action.error, isSending: false, sent: false }};

    default:
      return state;
  }
}
