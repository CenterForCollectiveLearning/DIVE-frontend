import {
  SELECT_REGRESSION_INDEPENDENT_VARIABLE,
  SELECT_REGRESSION_DEPENDENT_VARIABLE,
  RECEIVE_FIELD_PROPERTIES,
  REQUEST_RUN_REGRESSION,
  RECEIVE_RUN_REGRESSION,
  RECEIVE_CONTRIBUTION_TO_R_SQUARED,
  WIPE_PROJECT_STATE,
  CLEAR_ANALYSIS
} from '../constants/ActionTypes';

const baseState = {
  fieldProperties: [],
  dependentVariableId: null,
  independentVariableIds: [],
  regressionResult: {
    loading: false,
    data: null
  },
  contributionToRSquared: []
}

export default function regressionSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_REGRESSION_DEPENDENT_VARIABLE:
      const independentVariables = state.fieldProperties
        .filter((property) => property.id != action.dependentVariableId && !( property.generalType == 'c' && property.isUnique ) && !( property.generalType == 'c' && property.uniqueValues.length > 2 ))
        .map((property) => property.id)

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

    case RECEIVE_FIELD_PROPERTIES:
      const selectedIndependentVariables = action.fieldProperties
        .filter((property) => property.id != state.dependentVariableId && !( property.generalType == 'c' && property.isUnique ) && !( property.generalType == 'c' && property.uniqueValues && property.uniqueValues.length > 2 ))
        .map((property) => property.id);

      return { ...state, fieldProperties: action.fieldProperties, independentVariableIds: selectedIndependentVariables };

    case REQUEST_RUN_REGRESSION:
      return { ...state, regressionResult: { ...state.regressionResult, loading: true } };

    case RECEIVE_RUN_REGRESSION:
      return { ...state, regressionResult: { loading: false, data: action.data } };

    case RECEIVE_CONTRIBUTION_TO_R_SQUARED:
      return { ...state, contributionToRSquared: (action.data.data || []) };

    case WIPE_PROJECT_STATE, CLEAR_ANALYSIS:
      return baseState;

    default:
      return state;
  }
}
