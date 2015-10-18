import {
  SELECT_INDEPENDENT_VARIABLE
} from '../constants/ActionTypes';

export function selectIndependentVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_INDEPENDENT_VARIABLE,
    independentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}
