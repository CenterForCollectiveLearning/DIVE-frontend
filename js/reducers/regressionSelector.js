import {
  SELECT_INDEPENDENT_VARIABLE,
  SELECT_DEPENDENT_VARIABLE
} from '../constants/ActionTypes';

export default function regressionSelector(state = {
  independentVariableId: null,
  dependentVariableIds: []
}, action) {
  switch (action.type) {
    case SELECT_INDEPENDENT_VARIABLE:
      return { ...state, independentVariableId: action.independentVariableId };

    case SELECT_DEPENDENT_VARIABLE:
      var dependentVariableIds = state.dependentVariableIds.slice();
      if (state.dependentVariableIds.find((dependentVariableId) => dependentVariableId == action.dependentVariableId)) {
        dependentVariableIds = dependentVariableIds.filter((dependentVariableId) => dependentVariableId != action.dependentVariableId);
      } else {
        dependentVariableIds.push(action.dependentVariableId);
      }
      return { ...state, dependentVariableIds: dependentVariableIds};

    default:
      return state;
  }
}
