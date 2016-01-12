import {
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,
  SELECT_COMPARISON_DEPENDENT_VARIABLE,
  RECEIVE_CREATE_CONTINGENCY,
  RECEIVE_PERFORM_NUMERICAL_COMPARISON,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  independentVariableIds: [],
  dependentVariableId: null,
  contingencyResult: {},
  numericalComparisonResult: {}
}

export default function comparisonSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_COMPARISON_DEPENDENT_VARIABLE:
      return { ...state, dependentVariableId: action.dependentVariableId };

    case SELECT_COMPARISON_INDEPENDENT_VARIABLE:
      var independentVariableIds = state.independentVariableIds.slice();
      const selectedId = parseInt(action.independentVariableId);
      if (state.independentVariableIds.find((independentVariableId) => independentVariableId == selectedId)) {
        independentVariableIds = independentVariableIds.filter((independentVariableId) => independentVariableId != selectedId);
      } else {
        independentVariableIds.push(selectedId);
      }
      return { ...state, independentVariableIds: independentVariableIds};

    case RECEIVE_CREATE_CONTINGENCY:
      return { ...state, contingencyResult: action.data };
    case RECEIVE_PERFORM_NUMERICAL_COMPARISON:
      return { ...state, numericalComparisonResult: action.data}
    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
