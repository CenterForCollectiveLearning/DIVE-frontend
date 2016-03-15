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
} from '../constants/ActionTypes';

import { default } from 'cryptojs';
import { fetch } from './api.js';


function requestLoginUserDispatcher() {
  return {
    type: REQUEST_LOGIN_USER
  }
}

function receiveLoginUserDispatcher(json) {
  return {
    type: RECEIVE_LOGIN_USER,
    username: json.user.username,
    email: json.user.email,
    message: json.message
  }
}

function errorLoginUserDispatcher(error) {
  return {
    type: ERROR_LOGIN_USER,
    message: error.message
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
    username: json.user.username,
    email: json.user.email,
    message: json.message
  }
}

function errorRegisterUserDispatcher(error) {
  return {
    type: ERROR_REGISTER_USER,
    message: error.message
  }
}


export function loginUser(email, username, password) {
  const encryptedPassword = Crypto.MD5(password);
  const params = {
    'email': email,
    'username': username,
    'password': encryptedPassword
  };

  return (dispatch) => {
    dispatch(requestLoginUserDispatcher());
    return fetch('/auth/v1/login', {
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
        response.json().then( json =>
          dispatch(receiveLoginUserDispatcher(json))
        );
      }
    })
    .catch( error => { console.log('Login failed', error); });
  };
}

export function registerUser(email, username, password) {
  const encryptedPassword = Crypto.MD5(password);
  const params = {
    'email': email,
    'username': username,
    'password': encryptedPassword
  };

  return (dispatch) => {
    dispatch(requestRegisterUserDispatcher());
    return fetch('/auth/v1/register', {
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
    .catch( error => { console.log('Login failed', error); });
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
    return fetch('/auth/v1/logout', {
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
        response.json().then( json =>
          dispatch(receiveLogoutUserDispatcher(json))
        );
      }
    })
    .catch( error => { console.log('Logout failed', error); });
  };
}
