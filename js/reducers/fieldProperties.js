import {
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES
} from '../constants/ActionTypes';

export default function fieldProperties(state={
  isFetching: false,
  loaded: false,
  items: [],
  updatedAt: 0
}, action) {
  switch (action.type) {
    case REQUEST_FIELD_PROPERTIES:
      return { ...state, isFetching: true };

    case RECEIVE_FIELD_PROPERTIES:
      return { ...state, isFetching: false, items: action.fieldProperties, updatedAt: action.receivedAt };

    default:
      return state;
  }
}
