import {
  SELECT_COMPARISON_AGGREGATION_VARIABLE,
  SELECT_COMPARISON_INDEPENDENT_VARIABLE
} from '../constants/ActionTypes';

export function selectComparisonVariable(selectedIndependentVariableId) {
  return {
    type: SELECT_COMPARISON_INDEPENDENT_VARIABLE,
    comparisonIndependentVariableId: selectedIndependentVariableId,
    selectedAt: Date.now()
  }
}

export function selectAggregationVariable(selectedAggregationVariableId) {
  return {
    type: SELECT_COMPARISON_AGGREGATION_VARIABLE,
    comparisonAggregationVariableId: selectedAggregationVariableId,
    selectedAt: Date.now()
  }
}
