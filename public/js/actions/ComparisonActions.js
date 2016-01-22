import {
  SELECT_COMPARISON_VARIABLE
} from '../constants/ActionTypes';

import { fetch } from './api.js';

export function selectComparisonVariable(selectedVariableId) {
  return {
    type: SELECT_COMPARISON_VARIABLE,
    comparisonVariableId: selectedVariableId,
    selectedAt: Date.now()
  }
}
