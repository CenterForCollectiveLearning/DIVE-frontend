import _ from 'underscore';

import {
  WIPE_PROJECT_STATE,
  CLEAR_ANALYSIS,
  REQUEST_COMPARISON,
  PROGRESS_COMPARISON,
  RECEIVE_COMPARISON,
  ERROR_COMPARISON,
  SELECT_DATASET,
  UPDATE_COMPARISON_INPUT,
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_TYPE,
  SET_COMPARISON_QUERY_STRING,
} from '../constants/ActionTypes';

const baseState = {
  comparisonResult: {
    progress: null,
    loading: false,
    error: null,
    exported: false,
    exportedComparisonId: null,
    data: {
      numericalComparison: [],
      anovaBoxplot: {},
      pairwiseComparison: {},
      anova: {}
    }
  },
  queryString: null
}

export default function comparisonSelector(state = baseState, action) {
  switch (action.type) {

    case REQUEST_COMPARISON:
      return { ...state,
        comparisonResult: {
          ...state.comparisonResult,
          loading: true
        }
      };

    case PROGRESS_COMPARISON:
      if (action.progress && action.progress.length){
        return { ...state,
          comparisonResult: {
            ...state.comparisonResult,
            progress: action.progress,
            error: null
        }};
      }
      return state;

    case RECEIVE_COMPARISON:
     return { ...state,
       comparisonResult: {
         ...state.comparisonResult,
         exported: action.data.exported,
         exportedComparisonId: action.data.exportedComparisonId,
         error: null,
         loading: false,
         data: action.data
       }
     }

    case ERROR_COMPARISON:
      return { ...state, comparisonResult: { ...state.comparisonResult, loading: false, error: action.message } };

    case UPDATE_COMPARISON_INPUT:
      var inputDict = state.inputsDict;
      inputDict[action.test] = action.userInput;
      return { ...state, inputsDict: inputDict }

    case SET_COMPARISON_QUERY_STRING:
      return {
        ...state, queryString: action.queryString
      }

    case SELECT_DATASET:
    case CLEAR_ANALYSIS:
    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
