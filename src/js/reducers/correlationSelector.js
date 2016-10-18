import _ from 'underscore';

import {
  SELECT_DATASET,
  REQUEST_CORRELATION,
  RECEIVE_CORRELATION,
  PROGRESS_CORRELATION,
  ERROR_CORRELATION,
  RECEIVE_FIELD_PROPERTIES,
  RECEIVE_CORRELATION_SCATTERPLOT,
  RECEIVE_CREATED_SAVED_CORRELATION,
  WIPE_PROJECT_STATE,
  SET_CORRELATION_QUERY_STRING,
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_TYPE,
  CLEAR_ANALYSIS
} from '../constants/ActionTypes';

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
  correlationScatterplots: [],
  queryString: null
}

export default function correlationSelector(state = baseState, action) {
  switch (action.type) {
    case RECEIVE_FIELD_PROPERTIES:
      var quantitativeItemIds = action.fieldProperties.filter((item) => (item.generalType == 'q' && !item.isId)).map((item) => item.id)

      var n_q = quantitativeItemIds.length;
      var selectedVariableIds = [];

      if (n_q >= 3) {
        selectedVariableIds = _.sample(quantitativeItemIds, 3);
      } else if (n_q == 2) {
        selectedVariableIds = _.sample(quantitativeItemIds, 2);
      } else if (n_q == 1) {
        selectedVariableIds = _.sample(quantitativeItemIds, 1);
      }

      return { ...state, correlationVariableIds: selectedVariableIds};

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

    case SET_CORRELATION_QUERY_STRING:
      return {
        ...state, queryString: action.queryString
      }

    case WIPE_PROJECT_STATE, CLEAR_ANALYSIS, SELECT_DATASET:
      return baseState;

    case RECEIVE_CORRELATION_SCATTERPLOT:
      return { ...state, correlationScatterplots: (action.data.data || []) };

    default:
      return state;
  }
}
