import _ from 'underscore';

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
  REQUEST_ONE_D_AGGREGATION,
  RECEIVE_ONE_D_AGGREGATION,
  PROGRESS_ONE_D_AGGREGATION,
  ERROR_ONE_D_AGGREGATION,
  REQUEST_AGGREGATION_STATISTICS,
  RECEIVE_AGGREGATION_STATISTICS,
  PROGRESS_AGGREGATION_STATISTICS,
  ERROR_AGGREGATION_STATISTICS,
  WIPE_PROJECT_STATE,
  SELECT_DATASET,
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_TYPE,
  RECEIVE_FIELD_PROPERTIES,
  SET_AGGREGATION_QUERY_STRING,
} from '../constants/ActionTypes';

const baseState = {
  aggregationVariableId: 'count',
  aggregationVariablesIds: [],
  oneDimensionAggregationResult: {
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
  loadAggregation: false,
  queryString: null
}

export default function aggregationSelector(state = baseState, action) {
  switch (action.type) {

    case RECEIVE_FIELD_PROPERTIES:
      // Default selection
      let selectedAggregationVariablesIds;
      var categoricalItemIds = action.fieldProperties.filter((item) => (item.generalType == 'c') && (!item.isId)).map((item) => item.id);
      var quantitativeItemIds = action.fieldProperties.filter((item) => (item.generalType == 'q') && (!item.isId)).map((item) => item.id);
      var n_c = categoricalItemIds.length;
      var n_q = quantitativeItemIds.length;

      if ((n_c >= 1) && (n_q >= 1)) {
        selectedAggregationVariablesIds = [ _.sample(categoricalItemIds, 1)[0], _.sample(quantitativeItemIds, 1)[0] ]
      } else {
        if (n_c == 0) {
          if (n_q == 1) {
            selectedAggregationVariablesIds = _.sample(quantitativeItemIds, 1)
          }
          else if (n_q > 1) {
            selectedAggregationVariablesIds = _.sample(quantitativeItemIds, 2)
          }
        }
        else if (n_q == 0) {
          if (n_c == 1) {
            selectedAggregationVariablesIds = _.sample(categoricalItemIds, 1)
          }
          else if (n_c > 1) {
            selectedAggregationVariablesIds = _.sample(categoricalItemIds, 2)
          }
        }
      }

      return { ...state, aggregationVariablesIds: selectedAggregationVariablesIds };

    case SELECT_AGGREGATION_AGGREGATION_VARIABLE:
      return { ...state, aggregationVariableId: action.aggregationAggregationVariableId };

    case SELECT_AGGREGATION_INDEPENDENT_VARIABLE:
      var aggregationVariablesIds = state.aggregationVariablesIds.slice();
      const selectedId = parseInt(action.aggregationIndependentVariableId);
      if (state.aggregationVariablesIds.find((aggregationVariablesId) => aggregationVariablesId == selectedId)) {
        aggregationVariablesIds = aggregationVariablesIds.filter((aggregationVariablesId) => aggregationVariablesId != selectedId);
      } else {
        aggregationVariablesIds.push(selectedId);
      }
      return { ...state, aggregationVariablesIds: aggregationVariablesIds };

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

    case REQUEST_ONE_D_AGGREGATION:
      return { ...state, oneDimensionAggregationResult: { ...state.oneDimensionAggregationResult, loading: true }}

    case RECEIVE_ONE_D_AGGREGATION:
      return { ...state, oneDimensionAggregationResult: { ...state.oneDimensionAggregationResult, loading: false, data: action.data } };

    case PROGRESS_ONE_D_AGGREGATION:
      if (action.progress && action.progress.length){
        return { ...state, oneDimensionAggregationResult: { ...state.oneDimensionAggregationResult, progress: action.progress} };
      }
      return state;

    case ERROR_ONE_D_AGGREGATION:
      return { ...state, oneDimensionAggregationResult: { ...state.oneDimensionAggregationResult, loading: false, error: action.error } };

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

    case SET_AGGREGATION_QUERY_STRING:
      return {
        ...state, queryString: action.queryString
      }

    case WIPE_PROJECT_STATE:
      return baseState;

    case SELECT_DATASET:
    case WIPE_PROJECT_STATE, SELECT_DATASET:
      return baseState;

    default:
      return state;
  }
}
