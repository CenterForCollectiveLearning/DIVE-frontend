import {
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,
  SELECT_COMPARISON_DEPENDENT_VARIABLE,
  REQUEST_CREATE_CONTINGENCY,
  RECEIVE_CREATE_CONTINGENCY,
  REQUEST_PERFORM_NUMERICAL_COMPARISON,
  RECEIVE_PERFORM_NUMERICAL_COMPARISON,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  independentVariableIds: [],
  dependentVariableId: 'none',
  contingencyResult: {},
  numericalComparisonResult: {},
  fetchingContingency: false,
  fetchingComparison: false,
  comparisonLoaded: false
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
    case REQUEST_CREATE_CONTINGENCY:
      return {...state, fetchingContingency: true};
    case RECEIVE_CREATE_CONTINGENCY:
      return { ...state, contingencyResult: action.data, fetchingContingency: false};
    case RECEIVE_PERFORM_NUMERICAL_COMPARISON:
      return { ...state, numericalComparisonResult: action.data};
    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
