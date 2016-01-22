import {
  SELECT_COMPARISON_VARIABLE,
  WIPE_PROJECT_STATE,
  SELECT_DATASET
} from '../constants/ActionTypes';

const baseState = {
  comparisonVariablesIds: []
}

export default function summarySelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_COMPARISON_VARIABLE:
      var comparisonVariablesIds = state.comparisonVariablesIds.slice();
      const selectedId = parseInt(action.comparisonVariableId);
      if (state.comparisonVariablesIds.find((comparisonVariablesId) => comparisonVariablesId == selectedId)) {
        comparisonVariablesIds = comparisonVariablesIds.filter((comparisonVariablesId) => comparisonVariablesId != selectedId);
      } else {
        comparisonVariablesIds.push(selectedId);
      }
      return { ...state, comparisonVariablesIds: comparisonVariablesIds };

    case WIPE_PROJECT_STATE:
      return baseState;

    case SELECT_DATASET:
      return baseState;

    default:
      return state;
  }
}
