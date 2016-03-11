import {
  SELECT_SUMMARY_AGGREGATION_VARIABLE,
  SELECT_SUMMARY_INDEPENDENT_VARIABLE,
  SELECT_SUMMARY_AGGREGATION_FUNCTION,
  SELECT_SUMMARY_AGGREGATION_WEIGHT_VARIABLE,
  REQUEST_AGGREGATION,
  RECEIVE_AGGREGATION,
  PROGRESS_AGGREGATION,
  ERROR_AGGREGATION,
  REQUEST_ONE_D_COMPARISON,
  RECEIVE_ONE_D_COMPARISON,
  PROGRESS_ONE_D_COMPARISON,
  ERROR_ONE_D_COMPARISON,
  REQUEST_SUMMARY_STATISTICS,
  RECEIVE_SUMMARY_STATISTICS,
  PROGRESS_SUMMARY_STATISTICS,
  ERROR_SUMMARY_STATISTICS,
  WIPE_PROJECT_STATE,
  SELECT_DATASET,
  RECEIVE_FIELD_PROPERTIES
} from '../constants/ActionTypes';

const baseState = {
  aggregationVariableId: 'count',
  comparisonVariablesIds: [],
  oneDimensionComparisonResult: {
    loading: false,
    progress: null,
    error: null,
    data: null
  },
  aggregationResult: {
    loading: false,
    progress: null,
    error: null,
    data: null
  },
  aggregationFunction: 'SUM',
  weightVariableId: 'UNIFORM',
  summaryResult: {
    loading: false,
    progress: null,
    error: null,
    data: null
  },
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

    case REQUEST_AGGREGATION:
      return { ...state, aggregationResult: { ...state.aggregationResult, loading: true }}

    case RECEIVE_AGGREGATION:
      return { ...state, aggregationResult: { ...state.aggregationResult, loading: false, data: action.data } };

    case PROGRESS_AGGREGATION:
      if (action.progress && action.progress.length){
        return { ...state, aggregationResult: { ...state.aggregationResult, progress: action.progress} };
      }
      return state;

    case ERROR_AGGREGATION:
      return { ...state, aggregationResult: { ...state.aggregationResult, loading: false, error: action.error } };

    case REQUEST_ONE_D_COMPARISON:
      return { ...state, oneDimensionComparisonResult: { ...state.oneDimensionComparisonResult, loading: true }}

    case RECEIVE_ONE_D_COMPARISON:
      return { ...state, oneDimensionComparisonResult: { ...state.oneDimensionComparisonResult, loading: false, data: action.data } };

    case PROGRESS_ONE_D_COMPARISON:
      if (action.progress && action.progress.length){
        return { ...state, oneDimensionComparisonResult: { ...state.oneDimensionComparisonResult, progress: action.progress} };
      }
      return state;

    case ERROR_ONE_D_COMPARISON:
      return { ...state, oneDimensionComparisonResult: { ...state.oneDimensionComparisonResult, loading: false, error: action.error } };

    case REQUEST_SUMMARY_STATISTICS:
      return { ...state, summaryResult: { ...state.summaryResult, loading: true }}

    case RECEIVE_SUMMARY_STATISTICS:
      return { ...state, summaryResult: { ...state.summaryResult, loading: false, data: action.data } };

    case RECEIVE_SUMMARY_STATISTICS:
      return { ...state, summaryResult: { ...state.summaryResult, data: action.data } };

    case PROGRESS_SUMMARY_STATISTICS:
      if (action.progress && action.progress.length){
        return { ...state, summaryResult: { ...state.summaryResult, progress: action.progress} };
      }
      return state;

    case ERROR_SUMMARY_STATISTICS:
      return { ...state, summaryResult: { ...state.summaryResult, loading: false, error: action.error } };


    case SELECT_SUMMARY_AGGREGATION_FUNCTION:
      return { ...state, aggregationFunction: action.aggregationFunction};

    case SELECT_SUMMARY_AGGREGATION_WEIGHT_VARIABLE:
      return { ...state, weightVariableId: action.aggregationWeightVariableId }

    case WIPE_PROJECT_STATE, SELECT_DATASET:
      return baseState;

    default:
      return state;
  }
}
