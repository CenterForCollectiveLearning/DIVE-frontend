import {
  SELECT_REGRESSION_INDEPENDENT_VARIABLE,
  SELECT_REGRESSION_DEPENDENT_VARIABLE,
  RECEIVE_RUN_REGRESSION
} from '../constants/ActionTypes';

export default function regressionSelector(state = {
  dependentVariableId: null,
  independentVariableIds: [],
  regressionResult: {}
}, action) {
  switch (action.type) {
    case SELECT_REGRESSION_DEPENDENT_VARIABLE:
      return { ...state, dependentVariableId: action.dependentVariableId };

    case SELECT_REGRESSION_INDEPENDENT_VARIABLE:
      var independentVariableIds = state.independentVariableIds.slice();
      const selectedId = parseInt(action.independentVariableId);

      if (state.independentVariableIds.find((independentVariableId) => independentVariableId == selectedId)) {
        independentVariableIds = independentVariableIds.filter((independentVariableId) => independentVariableId != selectedId);
      } else {
        independentVariableIds.push(selectedId);
      }
      return { ...state, independentVariableIds: independentVariableIds};

    case RECEIVE_RUN_REGRESSION:
      return { ...state, regressionResult: action.data };

    default:
      return state;
  }
}
