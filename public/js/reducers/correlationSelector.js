import {
  WIPE_PROJECT_STATE,
  SELECT_DATASET,
  SELECT_CORRELATION_VARIABLE
} from '../constants/ActionTypes';

const baseState = {
  correlationVariableIds: [],
  correlationResult: {}
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

    case WIPE_PROJECT_STATE:
      return baseState;

    case SELECT_DATASET:
      return baseState;

    default:
      return state;
  }
}
