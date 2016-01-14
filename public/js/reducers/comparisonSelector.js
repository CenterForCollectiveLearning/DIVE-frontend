import {
  SELECT_COMPARISON_AGGREGATION_VARIABLE,
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,
  SELECT_COMPARISON_AGGREGATION_FUNCTION,
  RECEIVE_MAKE_COMPARISON,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  aggregationVariableId: null,
  comparisonVariablesIds: [],
  comparisonResult: {},
  aggregationFunction: 'SUM'
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
    case SELECT_COMPARISON_AGGREGATION_FUNCTION:
      return { ...state, aggregationFunction: action.comparisonAggregationFunction};

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
