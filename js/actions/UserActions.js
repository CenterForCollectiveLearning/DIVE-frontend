import {
  CREATE_ANONYMOUS_USER
} from '../constants/ActionTypes';
import { LOAD, SAVE } from 'redux-storage';
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
  if (user.loaded && !(user.properties || user.isFetching)) {
    return true;
  }
  return false;
}

function createAnonymousUser() {
  return {
    type: CREATE_ANONYMOUS_USER,
    userProperties: {
      id: uuid.v4()
    }
  };
}
