import {
  SELECT_SUMMARY_AGGREGATION_VARIABLE,
  SELECT_SUMMARY_INDEPENDENT_VARIABLE,
  SELECT_SUMMARY_AGGREGATION_FUNCTION,
  SELECT_SUMMARY_AGGREGATION_WEIGHT_VARIABLE,
  RECEIVE_AGGREGATION,
  RECEIVE_ONE_D_COMPARISON,
  RECEIVE_SUMMARY_STATISTICS,
  WIPE_PROJECT_STATE,
  SELECT_DATASET,
  RECEIVE_FIELD_PROPERTIES
} from '../constants/ActionTypes';

const baseState = {
  aggregationVariableId: 'count',
  comparisonVariablesIds: [],
  oneDimensionComparisonResult: {},
  aggregationResult: {},
  aggregationFunction: 'SUM',
  weightVariableId: 'UNIFORM',
  summaryResult: {},
  loadSummary: false
}

export default function summarySelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_SUMMARY_AGGREGATION_VARIABLE:
      return { ...state, aggregationVariableId: action.comparisonAggregationVariableId };

    case SELECT_SUMMARY_INDEPENDENT_VARIABLE:
      var comparisonVariablesIds = state.comparisonVariablesIds.slice();
      const selectedId = parseInt(action.comparisonIndependentVariableId);
      if (state.comparisonVariablesIds.find((comparisonVariablesId) => comparisonVariablesId == selectedId)) {
        comparisonVariablesIds = comparisonVariablesIds.filter((comparisonVariablesId) => comparisonVariablesId != selectedId);
      } else {
        comparisonVariablesIds.push(selectedId);
      }
      return { ...state, comparisonVariablesIds: comparisonVariablesIds };

    case RECEIVE_FIELD_PROPERTIES:
      return { ...state, loadSummary: true };
    case RECEIVE_AGGREGATION:
      return { ...state, aggregationResult: action.data};

    case RECEIVE_ONE_D_COMPARISON:
      return { ...state, oneDimensionComparisonResult: action.data };

    case RECEIVE_SUMMARY_STATISTICS:
      return { ...state, summaryResult: action.data };

    case SELECT_SUMMARY_AGGREGATION_FUNCTION:
      return { ...state, aggregationFunction: action.aggregationFunction};

    case SELECT_SUMMARY_AGGREGATION_WEIGHT_VARIABLE:
      return { ...state, weightVariableId: action.aggregationWeightVariableId }

    case WIPE_PROJECT_STATE:
      return baseState;

    case SELECT_DATASET:
      return baseState;

    default:
      return state;
  }
}
