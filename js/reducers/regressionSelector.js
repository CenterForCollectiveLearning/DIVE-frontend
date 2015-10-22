import {
  SELECT_REGRESSION_INDEPENDENT_VARIABLE,
  SELECT_REGRESSION_DEPENDENT_VARIABLE
} from '../constants/ActionTypes';

export default function regressionSelector(state = {
  dependentVariableId: null,
  independentVariableIds: []
}, action) {
  switch (action.type) {
    case SELECT_REGRESSION_DEPENDENT_VARIABLE:
      return { ...state, dependentVariableId: action.dependentVariableId };

    case SELECT_REGRESSION_INDEPENDENT_VARIABLE:
      var independentVariableIds = state.independentVariableIds.slice();
      if (state.independentVariableIds.find((independentVariableId) => independentVariableId == action.independentVariableId)) {
        independentVariableIds = independentVariableIds.filter((independentVariableId) => independentVariableId != action.independentVariableId);
      } else {
        independentVariableIds.push(action.independentVariableId);
      }
      return { ...state, independentVariableIds: independentVariableIds};

    default:
      return state;
  }
}
