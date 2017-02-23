import {
  REQUEST_LOGIN_USER,
  RECEIVE_LOGIN_USER,
  ERROR_LOGIN_USER,
  REQUEST_LOGOUT_USER,
  RECEIVE_LOGOUT_USER,
  ERROR_LOGOUT_USER,
  REQUEST_REGISTER_USER,
  RECEIVE_REGISTER_USER,
  ERROR_REGISTER_USER,
  REQUEST_CONFIRM_TOKEN,
  RECEIVE_CONFIRM_TOKEN,
  ERROR_CONFIRM_TOKEN
} from '../constants/ActionTypes';

import { detectClient } from '../helpers/clientdetection';
import cookie from 'react-cookie';
import { default } from 'cryptojs';
import { rawFetch } from './api.js';


function requestLoginUserDispatcher() {
  return {
    type: REQUEST_LOGIN_USER
  }
}

function receiveLoginUserDispatcher(json) {
  return {
    type: RECEIVE_LOGIN_USER,
    id: json.user.id,
    username: json.user.username,
    email: json.user.email,
    message: json.message
  }
}

function errorLoginUserDispatcher(error) {
  return {
    type: ERROR_LOGIN_USER,
    error: error.message.login
  }
}


function requestRegisterUserDispatcher() {
  return {
    type: REQUEST_REGISTER_USER
  }
}

function receiveRegisterUserDispatcher(json) {
  return {
    type: RECEIVE_REGISTER_USER,
    id: json.user.id,
    username: json.user.username,
    email: json.user.email,
    message: json.message
  }
}

function errorRegisterUserDispatcher(error) {
  return {
    type: ERROR_REGISTER_USER,
    emailError: error.message.email,
    usernameError: error.message.username
  }
}

function requestConfirmTokenDispatcher() {
  return {
    type: REQUEST_CONFIRM_TOKEN
  }
}

function receiveConfirmTokenDispatcher(json) {
  return {
    type: RECEIVE_CONFIRM_TOKEN,

  }
}

function errorConfirmTokenDispatcher() {
  return {
    type: RECEIVE_CONFIRM_TOKEN
  }
}

export function confirmToken(token) {
  return (dispatch) => {
    dispatch(requestConfirmTokenDispatcher());
    return rawFetch(`/auth/v1/confirm/${ token }`)
    .then((response) => {
      if (response.status >= 400) {
        response.json().then( json =>
          dispatch(errorConfirmTokenDispatcher(json))
        );
      } else {
        response.json().then( (json) => {
          console.log(json)
          window.amplitude.setUserId(json.user.email);
          return dispatch(receiveConfirmTokenDispatcher(json));
        });
      }
    })
    .catch( error => { console.log('Token confirmation failed', error); });
  }
}

export function loginUser(email, username, password, rememberMe) {
  const encryptedPassword = Crypto.MD5(password);
  const params = {
    'email': email,
    'username': username,
    'password': encryptedPassword,
    'rememberMe': rememberMe
  };

  return (dispatch) => {
    dispatch(requestLoginUserDispatcher());
    return rawFetch('/auth/v1/login', {
      credentials: 'include',
      method: 'post',
      credentials: 'include',
      body: JSON.stringify(params),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      if (response.status >= 400) {
        response.json().then( json =>
          dispatch(errorLoginUserDispatcher(json))
        );
      } else {
        response.json().then( json => {
          window.amplitude.setUserId(json.user.email);
          return dispatch(receiveLoginUserDispatcher(json));
        });
      }
    })
    .catch( error => { console.log('Login failed', error); });
  };
}

export function registerUser(email, username, password) {
  const encryptedPassword = Crypto.MD5(password);
  const clientInfo = detectClient();

  const params = {
    'email': email,
    'username': username,
    'password': encryptedPassword,
    'browser': clientInfo.browser,
    'os': clientInfo.os
  };

  return (dispatch) => {
    dispatch(requestRegisterUserDispatcher());
    return rawFetch('/auth/v1/register', {
      credentials: 'include',
      method: 'post',
      credentials: 'include',
      body: JSON.stringify(params),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      if (response.status >= 400) {
        response.json().then( json =>
          dispatch(errorRegisterUserDispatcher(json))
        );
      } else {
        response.json().then( json =>
          dispatch(receiveRegisterUserDispatcher(json))
        );
      }
    })
    .catch( error => { console.log('Registration failed', error); });
  };
}


function requestLogoutUserDispatcher() {
  return {
    type: REQUEST_LOGOUT_USER
  }
}

function receiveLogoutUserDispatcher(json) {
  return {
    type: RECEIVE_LOGOUT_USER
  }
}

function errorLogoutUserDispatcher(error) {
  return {
    type: ERROR_LOGOUT_USER,
    message: error.message
  }
}

export function logoutUser() {
  const params = {};

  return (dispatch) => {
    dispatch(requestLogoutUserDispatcher());
    return rawFetch('/auth/v1/logout', {
      method: 'post',
      credentials: 'include',
      body: JSON.stringify(params),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      if (response.status >= 400) {
        response.json().then( json =>
          dispatch(errorLogoutUserDispatcher(json))
        );
      } else {
        response.json().then( json => {
          window.amplitude.setUserId(null);
          window.amplitude.regenerateDeviceId();
          return dispatch(receiveLogoutUserDispatcher(json))
        });
      }
    })
    .catch( error => { console.log('Logout failed', error); });
  };
}
