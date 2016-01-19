import {
  SELECT_COMPARISON_AGGREGATION_VARIABLE,
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,
  SELECT_COMPARISON_AGGREGATION_FUNCTION,
  SELECT_COMPARISON_WEIGHT_VARIABLE,
  RECEIVE_MAKE_COMPARISON,
  RECEIVE_MAKE_ONE_D_COMPARISON,
  WIPE_PROJECT_STATE,
  SELECT_DATASET
} from '../constants/ActionTypes';

const baseState = {
  aggregationVariableId: null,
  comparisonVariablesIds: [],
  comparisonResult: {},
  oneDimensionComparisonResult: {},
  aggregationFunction: 'SUM',
  weightVariableId: 'UNIFORM'
}

export default function comparisonSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_COMPARISON_AGGREGATION_VARIABLE:
      return { ...state, aggregationVariableId: action.comparisonAggregationVariableId };

    case SELECT_COMPARISON_INDEPENDENT_VARIABLE:
      var comparisonVariablesIds = state.comparisonVariablesIds.slice();
      const selectedId = parseInt(action.comparisonIndependentVariableId);
      if (state.comparisonVariablesIds.find((comparisonVariablesId) => comparisonVariablesId == selectedId)) {
        comparisonVariablesIds = comparisonVariablesIds.filter((comparisonVariablesId) => comparisonVariablesId != selectedId);
      } else {
        comparisonVariablesIds.push(selectedId);
      }
      return { ...state, comparisonVariablesIds: comparisonVariablesIds};
    case RECEIVE_MAKE_COMPARISON:
      return { ...state, comparisonResult: action.data};
    case RECEIVE_MAKE_ONE_D_COMPARISON:
      return { ...state, oneDimensionComparisonResult: action.data };
    case SELECT_COMPARISON_AGGREGATION_FUNCTION:
      return { ...state, aggregationFunction: action.comparisonAggregationFunction};
    case SELECT_COMPARISON_WEIGHT_VARIABLE:
      return { ...state, weightVariableId: action.comparisonWeightVariableId }
    case WIPE_PROJECT_STATE:
      return baseState;
    case SELECT_DATASET:
      return baseState;

    default:
      return state;
  }
}
