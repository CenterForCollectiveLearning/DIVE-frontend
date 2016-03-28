import {
  SELECT_DATASET,
  SELECT_CORRELATION_VARIABLE,
  REQUEST_CORRELATION,
  RECEIVE_CORRELATION,
  PROGRESS_CORRELATION,
  ERROR_CORRELATION,
  RECEIVE_FIELD_PROPERTIES,
  RECEIVE_CORRELATION_SCATTERPLOT,
  WIPE_PROJECT_STATE,
  CLEAR_ANALYSIS
} from '../constants/ActionTypes';

const baseState = {
  correlationVariableIds: [],
  correlationResult: {
    loading: false,
    progress: null,
    error: null,
    data: null
  },
  correlationScatterplots: []
}

export default function correlationSelector(state = baseState, action) {
  switch (action.type) {

    case SELECT_CORRELATION_VARIABLE:
      var correlationVariableIds = state.correlationVariableIds.slice();
      const selectedId = parseInt(action.correlationVariableId);
      if (state.correlationVariableIds.find((correlationVariableId) => correlationVariableId == selectedId)) {
        correlationVariableIds = correlationVariableIds.filter((correlationVariableId) => correlationVariableId != selectedId);
      } else {
        correlationVariableIds.push(selectedId);
      }
      return { ...state, correlationVariableIds: correlationVariableIds };

    case REQUEST_CORRELATION:
      return { ...state, correlationResult: { ...state.correlationResult, loading: true } };

    case RECEIVE_CORRELATION:
      return { ...state, correlationResult: { loading: false, data: action.data } };

    case ERROR_CORRELATION:
      return { ...state, correlationResult: { ...state.correlationResult, error: action.error } };

    case PROGRESS_CORRELATION:
      if (action.progress && action.progress.length) {
        return { ...state, correlationResult: { ...state.correlationResult, progress: action.progress } };
      }
      return state;

    case RECEIVE_FIELD_PROPERTIES:
      var allQuantitativeItemIds = action.fieldProperties.filter((item) => item.generalType == 'q').map((item) => item.id)
      return { ...state, correlationVariableIds: allQuantitativeItemIds};

    case WIPE_PROJECT_STATE, CLEAR_ANALYSIS, SELECT_DATASET:
      return baseState;

    case RECEIVE_CORRELATION_SCATTERPLOT:
      return { ...state, correlationScatterplots: (action.data.data || []) };

    default:
      return state;
  }
}
