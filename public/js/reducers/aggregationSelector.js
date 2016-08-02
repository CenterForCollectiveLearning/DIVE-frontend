import {
  SELECT_AGGREGATION_AGGREGATION_VARIABLE,
  SELECT_AGGREGATION_INDEPENDENT_VARIABLE,
  SELECT_AGGREGATION_AGGREGATION_FUNCTION,
  SELECT_AGGREGATION_AGGREGATION_WEIGHT_VARIABLE,
  SELECT_AGGREGATION_CONFIG_X,
  SELECT_AGGREGATION_CONFIG_Y,
  REQUEST_AGGREGATION,
  RECEIVE_AGGREGATION,
  PROGRESS_AGGREGATION,
  ERROR_AGGREGATION,
  REQUEST_ONE_D_COMPARISON,
  RECEIVE_ONE_D_COMPARISON,
  PROGRESS_ONE_D_COMPARISON,
  ERROR_ONE_D_COMPARISON,
  REQUEST_AGGREGATION_STATISTICS,
  RECEIVE_AGGREGATION_STATISTICS,
  PROGRESS_AGGREGATION_STATISTICS,
  ERROR_AGGREGATION_STATISTICS,
  WIPE_PROJECT_STATE,
  SELECT_DATASET,
  RECEIVE_FIELD_PROPERTIES
} from '../constants/ActionTypes';

const baseConditional = {
  conditionalIndex: null,
  fieldId: null,
  operator: null,
  value: null
};

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
  aggregationResult: {},
  binningConfigX: {},
  binningConfigY: {},
  aggregationResult: {
    loading: false,
    progress: null,
    error: null,
    data: null
  },
  conditionals: [ baseConditional ],
  loadAggregation: false
}

export default function aggregationSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_AGGREGATION_AGGREGATION_VARIABLE:
      return { ...state, aggregationVariableId: action.comparisonAggregationVariableId };

    case SELECT_AGGREGATION_INDEPENDENT_VARIABLE:
      var comparisonVariablesIds = state.comparisonVariablesIds.slice();
      const selectedId = parseInt(action.comparisonIndependentVariableId);
      if (state.comparisonVariablesIds.find((comparisonVariablesId) => comparisonVariablesId == selectedId)) {
        comparisonVariablesIds = comparisonVariablesIds.filter((comparisonVariablesId) => comparisonVariablesId != selectedId);
      } else {
        comparisonVariablesIds.push(selectedId);
      }
      return { ...state, comparisonVariablesIds: comparisonVariablesIds };

    case RECEIVE_FIELD_PROPERTIES:
      return { ...state, loadAggregation: true };

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

    case REQUEST_AGGREGATION_STATISTICS:
      return { ...state, aggregationResult: { ...state.aggregationResult, loading: true }}

    case RECEIVE_AGGREGATION_STATISTICS:
      return { ...state, aggregationResult: { ...state.aggregationResult, loading: false, data: action.data } };

    case RECEIVE_AGGREGATION_STATISTICS:
      return { ...state, aggregationResult: { ...state.aggregationResult, data: action.data } };

    case PROGRESS_AGGREGATION_STATISTICS:
      if (action.progress && action.progress.length){
        return { ...state, aggregationResult: { ...state.aggregationResult, progress: action.progress} };
      }
      return state;

    case ERROR_AGGREGATION_STATISTICS:
      return { ...state, aggregationResult: { ...state.aggregationResult, loading: false, error: action.error } };


    case SELECT_AGGREGATION_AGGREGATION_FUNCTION:
      return { ...state, aggregationFunction: action.aggregationFunction};

    case SELECT_AGGREGATION_AGGREGATION_WEIGHT_VARIABLE:
      return { ...state, weightVariableId: action.aggregationWeightVariableId }

    case SELECT_AGGREGATION_CONFIG_X:
      return { ...state, binningConfigX: action.config }

    case SELECT_AGGREGATION_CONFIG_Y:
      return { ...state, binningConfigY: action.config }

    case WIPE_PROJECT_STATE:
      return baseState;

    case SELECT_DATASET:
    case WIPE_PROJECT_STATE, SELECT_DATASET:
      return baseState;

    default:
      return state;
  }
}
