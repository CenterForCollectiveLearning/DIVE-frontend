import {
  REQUEST_SPECS,
  RECEIVE_SPECS,
  FAILED_RECEIVE_SPECS
} from '../constants/ActionTypes';

export default function specs(state={
  isFetching: false,
  loaded: false,
  items: [],
  updatedAt: 0
}, action) {
  switch (action.type) {
    case REQUEST_SPECS:
      return { ...state, isFetching: true };
    case RECEIVE_SPECS:
      return { ...state, isFetching: false, items: action.specs, updatedAt: action.receivedAt };
    case FAILED_RECEIVE_SPECS:
      return { ...state, isFetching: false };    
    default:
      return state;
  }
}

