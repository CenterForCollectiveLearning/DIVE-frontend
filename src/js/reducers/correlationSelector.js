import {
  SELECT_DATASET,
  SELECT_CORRELATION_VARIABLE,
  REQUEST_CORRELATION,
  RECEIVE_CORRELATION,
  PROGRESS_CORRELATION,
  ERROR_CORRELATION,
  RECEIVE_FIELD_PROPERTIES,
  RECEIVE_CORRELATION_SCATTERPLOT,
  RECEIVE_CREATED_SAVED_CORRELATION,
  WIPE_PROJECT_STATE,
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_TYPE,  
  CLEAR_ANALYSIS
} from '../constants/ActionTypes';

const baseConditional = {
  conditionalIndex: null,
  fieldId: null,
  operator: null,
  value: null
};

const baseState = {
  correlationVariableIds: [],
  correlationResult: {
    exported: false,
    exportedCorrelationId: null,
    loading: false,
    progress: null,
    error: null,
    data: null
  },
  conditionals: [ baseConditional ],
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
      return { ...state,
        correlationResult: {
          loading: false,
          data: action.data,
          exported: action.data.exported,
          exportedCorrelationId: action.data.exportedCorrelationId,
        }
      };

    case ERROR_CORRELATION:
      return { ...state, correlationResult: { ...state.correlationResult, error: action.error } };

    case PROGRESS_CORRELATION:
      if (action.progress && action.progress.length) {
        return { ...state, correlationResult: { ...state.correlationResult, progress: action.progress } };
      }
      return state;

    case RECEIVE_CREATED_SAVED_CORRELATION:
      return { ...state,
        correlationResult: {
          ...state.correlationResult,
          exportedCorrelation: true,
          exportedCorrelationId: action.exportedCorrelationId
        }
      };

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
