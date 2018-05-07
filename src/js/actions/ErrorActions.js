import {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  REQUEST_TIMEOUT_ERROR,
  AUTH_ERROR,
  GENERAL_ERROR
} from '../constants/ActionTypes';

import { fetch } from './api.js';
import { push } from 'react-router-redux';

export function errorDispatcher(error) {
  switch (error.status) {
    case 400:
      return {
        type: BAD_REQUEST_ERROR,
        ...error
      };
    case 401:
      return {
        type: AUTH_ERROR,
        ...error
      };
    case 404:
      return {
        type: NOT_FOUND_ERROR,
        ...error
      };
    case 408:
      return {
        type: REQUEST_TIMEOUT_ERROR,
        ...error
      };
    default:
      return {
        type: GENERAL_ERROR,
        ...error
      }
  }
}
