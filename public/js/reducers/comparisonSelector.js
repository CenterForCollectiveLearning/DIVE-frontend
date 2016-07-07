import {
  SELECT_COMPARISON_INDEPENDENT_VARIABLE,
  SELECT_COMPARISON_DEPENDENT_VARIABLE,
  WIPE_PROJECT_STATE,
  RECEIVE_NUMERICAL_COMPARISON,
  UPDATE_COMPARISON_INPUT,
  RECEIVE_ANOVA,
  RECEIVE_ANOVA_BOXPLOT_DATA,
  SELECT_DATASET
} from '../constants/ActionTypes';

const baseState = {
  independentVariablesIds: [],
  dependentVariablesIds: [],
  numericalComparisonResult: {},
  anovaBoxplotData: [],
  anovaResult: {}
}

export default function comparisonSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_COMPARISON_INDEPENDENT_VARIABLE:
      var independentVariablesIds = state.independentVariablesIds.slice();
      const selectedIdIndependent = parseInt(action.independentVariableId);
      if (state.independentVariablesIds.find((independentVariablesId) => independentVariablesId == selectedIdIndependent)) {
        independentVariablesIds = independentVariablesIds.filter((independentVariablesId) => independentVariablesId != selectedIdIndependent);
      } else {
        independentVariablesIds.push(selectedIdIndependent);
      }
      return { ...state, independentVariablesIds: independentVariablesIds };

    case SELECT_COMPARISON_DEPENDENT_VARIABLE:
      var dependentVariablesIds = state.dependentVariablesIds.slice();
      const selectedIdDependent = parseInt(action.dependentVariableId);
      if (state.dependentVariablesIds.find((dependentVariablesId) => dependentVariablesId == selectedIdDependent)) {
        dependentVariablesIds = dependentVariablesIds.filter((dependentVariablesId) => dependentVariablesId != selectedIdDependent);
      } else {
        dependentVariablesIds.push(selectedIdDependent);
      }
      return { ...state, dependentVariablesIds: dependentVariablesIds };

    case RECEIVE_NUMERICAL_COMPARISON:
      return { ...state, numericalComparisonResult: action.data };

    case RECEIVE_ANOVA:
      return { ...state, anovaResult: action.data };

    case RECEIVE_ANOVA_BOXPLOT_DATA:
      return { ...state, anovaBoxplotData: action.data };

    case UPDATE_COMPARISON_INPUT:
      var inputDict = state.inputsDict;
      inputDict[action.test] = action.userInput;
      return { ...state, inputsDict: inputDict }

    case WIPE_PROJECT_STATE:
      return baseState;

    case SELECT_DATASET:
      return baseState;

    default:
      return state;
  }
}
