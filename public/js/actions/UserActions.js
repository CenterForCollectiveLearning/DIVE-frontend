import {
  CREATE_ANONYMOUS_USER,
  SET_USER_EMAIL,
  SUBMIT_USER
} from '../constants/ActionTypes';
import uuid from 'uuid';

export function createAnonymousUserIfNeeded() {
  return (dispatch, getState) => {
    if (shouldCreateAnonymousUser(getState())) {
      return dispatch(createAnonymousUser());
    }
  }
}

function shouldCreateAnonymousUser(state) {
  const { user } = state;
  if (user.loaded && !(user.properties.id || user.isFetching)) {
    return true;
  }
  return false;
}

function createAnonymousUser() {
  return {
    type: CREATE_ANONYMOUS_USER,
    userProperties: {
      id: uuid.v4(),
      email: null,
      submitted: false
    }
  };
}

export function setUserEmail(email) {
  return {
    type: SET_USER_EMAIL,
    email: email
  };
}

function submitUserDispatcher() {
  return {
    type: SUBMIT_USER
  }
}

export function submitUser() {
  return (dispatch, getState) => {
    dispatch(submitUserDispatcher());

    const { user } = getState();
    const googleFormUrl = "https://script.google.com/macros/s/AKfycbxOyk7PLciiHODnyQwN8MKXGQd_jvIBxzdssguWpkrEIpSh_is/exec";
    const formUrl = `${ googleFormUrl }?email=${ user.properties.email }&auid=${ user.properties.id }`;

    return fetch(formUrl);
  };
}
