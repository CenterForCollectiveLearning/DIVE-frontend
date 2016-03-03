import {
  REQUEST_LOGIN_USER,
  RECEIVE_LOGIN_USER,
  REQUEST_REGISTER_USER,
  RECEIVE_REGISTER_USER
} from '../constants/ActionTypes';

import { fetch } from './api.js';

function requestLoginUserDispatcher() {
  return {
    type: REQUEST_LOGIN_USER
  }
}

function receiveLoginUserDispatcher(json) {
  return {
    type: RECEIVE_LOGIN_USER
  }
}

export function loginUser(email, username, password) {
  const params = {
    'email': email,
    'username': username,
    'password': password
  };

  return (dispatch) => {
    dispatch(requestLoginUserDispatcher());
    return fetch('/auth/v1/login', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(json =>
        receiveLoginUserDispatcher(json)
      );
  };
}
