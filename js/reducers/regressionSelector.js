import {
  SELECT_REGRESSION_INDEPENDENT_VARIABLE,
  SELECT_REGRESSION_DEPENDENT_VARIABLE,
  RECEIVE_RUN_REGRESSION,
  RECEIVE_CONTRIBUTION_TO_R_SQUARED
} from '../constants/ActionTypes';

export default function regressionSelector(state = {
  dependentVariableId: null,
  independentVariableIds: [],
  regressionResult: {},
  contributionToRSquared: []
}, action) {
  switch (action.type) {
    case SELECT_REGRESSION_DEPENDENT_VARIABLE:
      const independentVariables = state.independentVariableIds.slice()
        .map((variable) => new Object({...variable, selected: false}));
      return { ...state, dependentVariableId: action.dependentVariableId, independentVariableIds: independentVariables };

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

    case RECEIVE_CONTRIBUTION_TO_R_SQUARED:
      return { ...state, contributionToRSquared: (action.data.data || []) };

    default:
      return state;
  }
}
