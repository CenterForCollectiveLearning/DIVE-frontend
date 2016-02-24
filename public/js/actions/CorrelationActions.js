import {
  SELECT_CORRELATION_VARIABLE
} from '../constants/ActionTypes';

import { fetch } from './api.js';

export function selectCorrelationVariable(selectedCorrelationVariable) {
  return {
    type: SELECT_CORRELATION_VARIABLE,
    correlationVariableId: selectedCorrelationVariable,
    selectedAt: Date.now()
  }
}
