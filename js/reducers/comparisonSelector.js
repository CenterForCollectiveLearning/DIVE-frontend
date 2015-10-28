import {
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,
  SELECT_COMPARISON_DEPENDENT_VARIABLE,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  independentVariableId: null,
  dependentVariableIds: []
}

export default function comparisonSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_COMPARISON_INDEPENDENT_VARIABLE:
      return { ...state, independentVariableId: action.independentVariableId };

    case SELECT_COMPARISON_DEPENDENT_VARIABLE:
      var dependentVariableIds = state.dependentVariableIds.slice();
      if (state.dependentVariableIds.find((dependentVariableId) => dependentVariableId == action.dependentVariableId)) {
        dependentVariableIds = dependentVariableIds.filter((dependentVariableId) => dependentVariableId != action.dependentVariableId);
      } else {
        dependentVariableIds.push(action.dependentVariableId);
      }
      return { ...state, dependentVariableIds: dependentVariableIds};

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
