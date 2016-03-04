import {
  REQUEST_LOGIN_USER,
  RECEIVE_LOGIN_USER,
  REQUEST_REGISTER_USER,
  RECEIVE_REGISTER_USER,
  ERROR_LOGIN_USER
} from '../constants/ActionTypes';

import { fetch } from './api.js';

function requestLoginUserDispatcher() {
  return {
    type: REQUEST_LOGIN_USER
  }
}

function receiveLoginUserDispatcher(json) {
  return {
    type: RECEIVE_LOGIN_USER,
    user: json
  }
}

function errorLoginUserDispatcher(error) {
  return {
    type: ERROR_LOGIN_USER,
    message: error.message
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
