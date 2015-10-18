import {
  SELECT_INDEPENDENT_VARIABLE
} from '../constants/ActionTypes';

export default function regressionSelector(state = {
  independentVariableId: null,
  dependentVariables: []
}, action) {
  switch (action.type) {
    case SELECT_INDEPENDENT_VARIABLE:
      return { ...state, independentVariableId: action.independentVariableId };
    default:
      return state;
  }
}
