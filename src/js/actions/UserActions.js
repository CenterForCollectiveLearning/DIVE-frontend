import {
  REQUEST_CREATE_ANONYMOUS_USER,
  RECEIVE_CREATE_ANONYMOUS_USER,
  SET_USER_EMAIL,
  SUBMIT_USER,
  SHOW_TOAST
} from '../constants/ActionTypes';

import cookie from 'react-cookie';
import uuid from 'uuid';
import { fetch } from './api.js';

export function showToast() {
  return (dispatch) => dispatch({
    type: SHOW_TOAST
  })
}

export function clearCookies() {
  cookie.remove('anonymous');
  cookie.remove('remember_token');
  cookie.remove('username');
  cookie.remove('email');
  cookie.remove('user_id');
  cookie.remove('confirmed');
}

export function createAnonymousUserIfNeeded() {
  return (dispatch) => {
      dispatch(requestCreateAnonymousUser());
      return fetch('/auth/v1/anonymous_user')
        .then((json) => dispatch(receiveCreateAnonymousUser(json)));
  }
}

export function deleteAnonymousData(userId) {
  return (dispatch) => {
    return fetch(`/auth/v1/delete_anonymous_data/${ userId }`, {
      method: 'get'
    }).then((json) => console.log(json));
  }
}

function requestCreateAnonymousUser() {
  return {
    type: REQUEST_CREATE_ANONYMOUS_USER
  }
}

function receiveCreateAnonymousUser(json) {
  return {
    type: RECEIVE_CREATE_ANONYMOUS_USER,
    id: json.user.id,
    email: json.user.email,
    username: json.user.username
  }
}
