import {
  SELECT_INDEPENDENT_VARIABLE,
  SELECT_DEPENDENT_VARIABLE
} from '../constants/ActionTypes';

export function selectIndependentVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_INDEPENDENT_VARIABLE,
    independentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}

export function selectDependentVariable(selectedDependentVariableId) {
  return {
    type: SELECT_DEPENDENT_VARIABLE,
    dependentVariableId: selectedDependentVariableId,
    selectedAt: Date.now()
  }
}
