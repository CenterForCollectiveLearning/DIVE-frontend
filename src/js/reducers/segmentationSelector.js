import _ from 'underscore';

import {
  SELECT_SEGMENTATION_SEGMENTATION_VARIABLE,
  SELECT_SEGMENTATION_INDEPENDENT_VARIABLE,
  SELECT_SEGMENTATION_SEGMENTATION_FUNCTION,
  SELECT_SEGMENTATION_SEGMENTATION_WEIGHT_VARIABLE,
  SELECT_SEGMENTATION_CONFIG_X,
  SELECT_SEGMENTATION_CONFIG_Y,
  REQUEST_SEGMENTATION,
  RECEIVE_SEGMENTATION,
  PROGRESS_SEGMENTATION,
  ERROR_SEGMENTATION,
  REQUEST_ONE_D_SEGMENTATION,
  RECEIVE_ONE_D_SEGMENTATION,
  PROGRESS_ONE_D_SEGMENTATION,
  ERROR_ONE_D_SEGMENTATION,
  REQUEST_SEGMENTATION_STATISTICS,
  RECEIVE_SEGMENTATION_STATISTICS,
  PROGRESS_SEGMENTATION_STATISTICS,
  ERROR_SEGMENTATION_STATISTICS,
  WIPE_PROJECT_STATE,
  SELECT_DATASET,
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_TYPE,
  RECEIVE_FIELD_PROPERTIES
} from '../constants/ActionTypes';

const baseState = {
  segmentationVariableId: 'count',
  segmentationVariablesIds: [],
  oneDimensionSegmentationResult: {
    loading: false,
    progress: null,
    error: null,
    data: null
  },
  segmentationResult: {
    loading: false,
    progress: null,
    error: null,
    data: null
  },
  segmentationFunction: 'SUM',
  weightVariableId: 'UNIFORM',
  segmentationResult: {},
  binningConfigX: {},
  binningConfigY: {},
  segmentationResult: {
    loading: false,
    progress: null,
    error: null,
    data: null
  },
  loadSegmentation: false
}

export default function segmentationSelector(state = baseState, action) {
  switch (action.type) {

    case RECEIVE_FIELD_PROPERTIES:
      // Default selection
      let selectedSegmentationVariablesIds;
      var categoricalItemIds = action.fieldProperties.filter((item) => (item.generalType == 'c') && (!item.isId)).map((item) => item.id);
      var quantitativeItemIds = action.fieldProperties.filter((item) => (item.generalType == 'q') && (!item.isId)).map((item) => item.id);
      var n_c = categoricalItemIds.length;
      var n_q = quantitativeItemIds.length;

      if ((n_c >= 1) && (n_q >= 1)) {
        selectedSegmentationVariablesIds = [ _.sample(categoricalItemIds, 1)[0], _.sample(quantitativeItemIds, 1)[0] ]
      } else {
        if (n_c == 0) {
          if (n_q == 1) {
            selectedSegmentationVariablesIds = _.sample(quantitativeItemIds, 1)
          }
          else if (n_q > 1) {
            selectedSegmentationVariablesIds = _.sample(quantitativeItemIds, 2)
          }
        }
        else if (n_q == 0) {
          if (n_c == 1) {
            selectedSegmentationVariablesIds = _.sample(categoricalItemIds, 1)
          }
          else if (n_c > 1) {
            selectedSegmentationVariablesIds = _.sample(categoricalItemIds, 2)
          }
        }
      }

      return { ...state, segmentationVariablesIds: selectedSegmentationVariablesIds };

    case SELECT_SEGMENTATION_SEGMENTATION_VARIABLE:
      return { ...state, segmentationVariableId: action.segmentationSegmentationVariableId };

    case SELECT_SEGMENTATION_INDEPENDENT_VARIABLE:
      var segmentationVariablesIds = state.segmentationVariablesIds.slice();
      const selectedId = parseInt(action.segmentationIndependentVariableId);
      if (state.segmentationVariablesIds.find((segmentationVariablesId) => segmentationVariablesId == selectedId)) {
        segmentationVariablesIds = segmentationVariablesIds.filter((segmentationVariablesId) => segmentationVariablesId != selectedId);
      } else {
        segmentationVariablesIds.push(selectedId);
      }
      return { ...state, segmentationVariablesIds: segmentationVariablesIds };

    case RECEIVE_FIELD_PROPERTIES:
      return { ...state, loadSegmentation: true };

    case REQUEST_SEGMENTATION:
      return { ...state, segmentationResult: { ...state.segmentationResult, loading: true }}

    case RECEIVE_SEGMENTATION:
      return { ...state, segmentationResult: { ...state.segmentationResult, loading: false, data: action.data } };

    case PROGRESS_SEGMENTATION:
      if (action.progress && action.progress.length){
        return { ...state, segmentationResult: { ...state.segmentationResult, progress: action.progress} };
      }
      return state;

    case ERROR_SEGMENTATION:
      return { ...state, segmentationResult: { ...state.segmentationResult, loading: false, error: action.error } };

    case REQUEST_ONE_D_SEGMENTATION:
      return { ...state, oneDimensionSegmentationResult: { ...state.oneDimensionSegmentationResult, loading: true }}

    case RECEIVE_ONE_D_SEGMENTATION:
      return { ...state, oneDimensionSegmentationResult: { ...state.oneDimensionSegmentationResult, loading: false, data: action.data } };

    case PROGRESS_ONE_D_SEGMENTATION:
      if (action.progress && action.progress.length){
        return { ...state, oneDimensionSegmentationResult: { ...state.oneDimensionSegmentationResult, progress: action.progress} };
      }
      return state;

    case ERROR_ONE_D_SEGMENTATION:
      return { ...state, oneDimensionSegmentationResult: { ...state.oneDimensionSegmentationResult, loading: false, error: action.error } };

    case REQUEST_SEGMENTATION_STATISTICS:
      return { ...state, segmentationResult: { ...state.segmentationResult, loading: true }}

    case RECEIVE_SEGMENTATION_STATISTICS:
      return { ...state, segmentationResult: { ...state.segmentationResult, loading: false, data: action.data } };

    case RECEIVE_SEGMENTATION_STATISTICS:
      return { ...state, segmentationResult: { ...state.segmentationResult, data: action.data } };

    case PROGRESS_SEGMENTATION_STATISTICS:
      if (action.progress && action.progress.length){
        return { ...state, segmentationResult: { ...state.segmentationResult, progress: action.progress} };
      }
      return state;

    case ERROR_SEGMENTATION_STATISTICS:
      return { ...state, segmentationResult: { ...state.segmentationResult, loading: false, error: action.error } };

    case SELECT_SEGMENTATION_SEGMENTATION_FUNCTION:
      return { ...state, segmentationFunction: action.segmentationFunction};

    case SELECT_SEGMENTATION_SEGMENTATION_WEIGHT_VARIABLE:
      return { ...state, weightVariableId: action.segmentationWeightVariableId }

    case SELECT_SEGMENTATION_CONFIG_X:
      return { ...state, binningConfigX: action.config }

    case SELECT_SEGMENTATION_CONFIG_Y:
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
