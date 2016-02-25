import {
  SELECT_DATASET,
  SELECT_CORRELATION_VARIABLE,
  RECEIVE_CORRELATION,
  RECEIVE_FIELD_PROPERTIES,
  RECEIVE_CORRELATION_SCATTERPLOT,
  WIPE_PROJECT_STATE,
  CLEAR_ANALYSIS
} from '../constants/ActionTypes';

const baseState = {
  correlationVariableIds: [],
  correlationResult: {},
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

    case RECEIVE_CORRELATION:
      return { ...state, correlationResult: action.data };

    case RECEIVE_FIELD_PROPERTIES:
      var allQuantitativeItemIds = action.fieldProperties.filter((item) => item.generalType == 'q').map((item) => item.id)
      return { ...state, correlationVariableIds: allQuantitativeItemIds}

    case WIPE_PROJECT_STATE:
      return baseState;

    case SELECT_DATASET:
      return baseState;

    case WIPE_PROJECT_STATE, CLEAR_ANALYSIS:
      return baseState;

    case RECEIVE_CORRELATION_SCATTERPLOT:
      return { ...state, correlationScatterplots: (action.data.data || []) };

    default:
      return state;
  }
}
