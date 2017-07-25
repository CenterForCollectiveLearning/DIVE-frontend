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
  ERROR_CONFIRM_TOKEN,
  REQUEST_RESEND_EMAIL,
  RECEIVE_RESEND_EMAIL,
  ERROR_RESEND_EMAIL,
  REQUEST_RESET_PASSWORD_EMAIL,
  RECEIVE_RESET_PASSWORD_EMAIL,
  ERROR_RESET_PASSWORD_EMAIL,
  REQUEST_RESET_PASSWORD_SUBMIT,
  RECEIVE_RESET_PASSWORD_SUBMIT,
  ERROR_RESET_PASSWORD_SUBMIT,
} from '../constants/ActionTypes';

import { push } from 'react-router-redux';

import { detectClient } from '../helpers/auth';
import cookie from 'react-cookie';
import MD5 from 'crypto-js/md5';
import { rawFetch } from './api';


function requestLoginUserDispatcher() {
  return {
    type: REQUEST_LOGIN_USER
  }
}

function receiveLoginUserDispatcher(json) {
  return {
    type: RECEIVE_LOGIN_USER,
    confirmed: json.user.confirmed,
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
    confirmed: true,
    alreadyActivated: json.alreadyActivated,
    id: json.user.id,
    username: json.user.username,
    email: json.user.email,
    message: json.message
  }
}

function errorConfirmTokenDispatcher(error) {
  return {
    type: ERROR_CONFIRM_TOKEN,
    error: error.message
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
        response.json().then((json) => {
          window.amplitude.setUserId(json.user.email);
          return dispatch(receiveConfirmTokenDispatcher(json));
        });
      }
    })
    .catch( error => { console.log('Token confirmation failed', error); });
  }
}

export function loginUser(email, username, password, rememberMe) {
  const encryptedPassword = MD5(password).toString();
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

export function registerUser(userId, email, username, password) {
  const encryptedPassword = MD5(password).toString();
  const clientInfo = detectClient();
  const siteUrl = location.host;

  const params = {
    user_id: userId,
    email: email,
    username: username,
    password: encryptedPassword,
    browser: clientInfo.browser,
    os: clientInfo.os,
    site_url: siteUrl
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

function goHome() {
  push('/');
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
    .then(goHome())
    .catch( error => { console.error('Logout failed', error); });
  };
}

function requestResendEmailDispatcher() {
  return {
    type: REQUEST_RESEND_EMAIL
  }
}

function receiveResendEmailDispatcher(json) {
  return {
    type: RECEIVE_RESEND_EMAIL
  }
}

function errorResendEmailDispatcher(error) {
  return {
    type: ERROR_RESEND_EMAIL,
    error: error.message
  }
}

export function resendConfirmationEmail(email) {
  const clientInfo = detectClient();
  const siteUrl = location.host;

  const params = {
    email: email,
    browser: clientInfo.browser,
    os: clientInfo.os,
    site_url: siteUrl
  };

  return (dispatch) => {
    dispatch(requestResendEmailDispatcher());
    return rawFetch('/auth/v1/resend', {
      credentials: 'include',
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
          dispatch(errorResendEmailDispatcher(json))
        );
      } else {
        response.json().then( json =>
          dispatch(receiveResendEmailDispatcher(json))
        );
      }
    })
    .catch( error => { console.log('Resending E-mail Failed', error); });
  };
}

function requestResetPasswordEmailDispatcher() {
  return {
    type: REQUEST_RESET_PASSWORD_EMAIL
  }
}

function receiveResetPasswordEmailDispatcher(json) {
  return {
    type: RECEIVE_RESET_PASSWORD_EMAIL
  }
}

function errorResetPasswordEmailDispatcher(error) {
  return {
    type: ERROR_RESET_PASSWORD_EMAIL,
    error: error.message
  }
}

export function sendResetPasswordEmail(email) {
  const clientInfo = detectClient();
  const siteUrl = location.host;

  const params = {
    email: email,
    browser: clientInfo.browser,
    os: clientInfo.os,
    site_url: siteUrl
  };

  return (dispatch) => {
    dispatch(requestResetPasswordEmailDispatcher());
    return rawFetch('/auth/v1/reset_password', {
      credentials: 'include',
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
          dispatch(errorResetPasswordEmailDispatcher(json))
        );
      } else {
        response.json().then( json =>
          dispatch(receiveResetPasswordEmailDispatcher(json))
        );
      }
    })
    .catch( error => { console.log('Sending reset passwrod e-mail failed', error); });
  };
}

function requestResetPasswordSubmitDispatcher() {
  return {
    type: REQUEST_RESET_PASSWORD_SUBMIT
  }
}

function receiveResetPasswordSubmitDispatcher(json) {
  return {
    type: RECEIVE_RESET_PASSWORD_SUBMIT,
    message: json.message
  }
}

function errorResetPasswordSubmitDispatcher(error) {
  return {
    type: ERROR_RESET_PASSWORD_SUBMIT,
    error: error.message
  }
}

export function sendResetPasswordSubmit(token, password) {
  const encryptedPassword = MD5(password).toString();

  const params = {
    token: token,
    password: encryptedPassword
  };

  return (dispatch) => {
    dispatch(requestResetPasswordSubmitDispatcher());
    return rawFetch(`/auth/v1/reset_password/${ token }`, {
      credentials: 'include',
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
          dispatch(errorResetPasswordSubmitDispatcher(json))
        );
      } else {
        response.json().then( json =>
          dispatch(receiveResetPasswordSubmitDispatcher(json))
        );
      }
    })
    .catch( error => { console.log('Sending reset passwrod e-mail failed', error); });
  };
}
