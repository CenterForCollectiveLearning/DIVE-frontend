import _ from 'underscore';

import {
  WIPE_PROJECT_STATE,
  RECEIVE_NUMERICAL_COMPARISON,
  UPDATE_COMPARISON_INPUT,
  RECEIVE_ANOVA,
  RECEIVE_ANOVA_BOXPLOT_DATA,
  RECEIVE_PAIRWISE_COMPARISON_DATA,
  SELECT_DATASET,
  RECEIVE_FIELD_PROPERTIES,
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_TYPE,
  SET_COMPARISON_QUERY_STRING,
} from '../constants/ActionTypes';

const baseState = {
  numericalComparisonResult: {},
  anovaBoxplotData: {},
  pairwiseComparisonData: {},
  anovaResult: {},
  queryString: null
}

export default function comparisonSelector(state = baseState, action) {
  switch (action.type) {

    case RECEIVE_FIELD_PROPERTIES:
      // Default selection
      var modifiedState = { ...state };

      var categoricalItemIds = action.fieldProperties.filter((item) => ((item.generalType == 'c') && (!item.isId))).map((item) => item.id);
      var quantitativeItemIds = action.fieldProperties.filter((item) => ((item.generalType == 'q') && (!item.isId))).map((item) => item.id);
      var n_c = categoricalItemIds.length;
      var n_q = quantitativeItemIds.length;

      if ((n_c >= 2) && (n_q >= 1)) {
        modifiedState.independentVariablesIds = _.sample(categoricalItemIds, 1);
        modifiedState.dependentVariablesIds = _.sample(quantitativeItemIds, 1);
      } else {
        if (n_c == 0) {
          if (n_q >= 2) {
            modifiedState.independentVariablesIds = _.sample(quantitativeItemIds, 2);
          }
        } else if (n_c == 1) {
          if (n_q >= 1) {
            modifiedState.dependentVariablesIds = _.sample(quantitativeItemIds, 1);
            modifiedState.independentVariablesIds = _.sample(categoricalItemIds, 1);
          }
        }
      }

      return modifiedState;

    case RECEIVE_NUMERICAL_COMPARISON:
      return { ...state, numericalComparisonResult: action.data };

    case RECEIVE_ANOVA:
      return { ...state, anovaResult: action.data };

    case RECEIVE_ANOVA_BOXPLOT_DATA:
      return { ...state, anovaBoxplotData: action.data };

    case RECEIVE_PAIRWISE_COMPARISON_DATA:
      return { ...state, pairwiseComparisonData: action.data };

    case UPDATE_COMPARISON_INPUT:
      var inputDict = state.inputsDict;
      inputDict[action.test] = action.userInput;
      return { ...state, inputsDict: inputDict }

    case SET_COMPARISON_QUERY_STRING:
      return {
        ...state, queryString: action.queryString
      }

    case WIPE_PROJECT_STATE:
      return baseState;

    case SELECT_DATASET:
      return baseState;

    default:
      return state;
  }
}
