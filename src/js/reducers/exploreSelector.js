import {
  SELECT_DATASET,
  REQUEST_EXACT_SPECS,
  REQUEST_INDIVIDUAL_SPECS,
  REQUEST_SUBSET_SPECS,
  REQUEST_EXPANDED_SPECS,
  RECEIVE_EXACT_SPECS,
  RECEIVE_INDIVIDUAL_SPECS,
  RECEIVE_SUBSET_SPECS,
  RECEIVE_EXPANDED_SPECS,
  PROGRESS_EXACT_SPECS,
  PROGRESS_INDIVIDUAL_SPECS,
  PROGRESS_SUBSET_SPECS,
  PROGRESS_EXPANDED_SPECS,
  ERROR_EXACT_SPECS,
  ERROR_INDIVIDUAL_SPECS,
  ERROR_SUBSET_SPECS,
  ERROR_EXPANDED_SPECS,
  SELECT_FIELD_PROPERTY_VALUE,
  SELECT_AGGREGATION_FUNCTION,
  SELECT_SORTING_FUNCTION,
  SELECT_RECOMMENDATION_TYPE,
  WIPE_PROJECT_STATE,
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_TYPE,
  RECEIVE_SET_FIELD_COLOR,
  SET_EXPLORE_QUERY_STRING,
  SELECT_RECOMMENDATION_MODE
} from '../constants/ActionTypes';

const recommendationTypes = [
  {
    id: 'exact',
    level: 0,
  },
  {
    id: 'subset',
    level: 1
  },
  {
    id: 'baseline',
    level: 2
  },
  {
    id: 'expanded',
    level: 3
  }
]

const recommendationTypesToLevel = {
  exact: 0,
  subset: 1,
  individual: 2,
  expanded: 3
}

const recommendationModes = [
  {
    id: 'regular',
    name: 'Regular'
  },
  {
    id: 'expanded',
    name: 'Expanded'
  }
]

const sortingFunctions = [
  {
    'label': 'relevance',
    'value': 'relevance'
  },
  {
    'label': 'correlation',
    'value': 'correlation'
  },
  {
    'label': 'gini',
    'value': 'gini'
  },
  {
    'label': 'entropy',
    'value': 'entropy'
  },
  {
    'label': 'variance',
    'value': 'variance'
  },
  {
    'label': 'normality',
    'value': 'normality'
  },
  {
    'label': 'size',
    'value': 'size'
  }
];

const baseState = {
  datasetId: null,
  fieldProperties: [],
  originalFieldProperties: [],
  recommendationTypesToLevel: recommendationTypesToLevel,
  recommendationTypes: recommendationTypes,
  recommendationModes: recommendationModes,
  selectedRecommendationMode: 'regular',
  specs: [],
  sortingFunctions: sortingFunctions,
  queryString: "",
  progressByLevel: [ null, null, null, null ],
  isFetchingSpecLevel: [ false, false, false, false ],
  loadedSpecLevel: [ false, false, false, false ],
  errorByLevel: [ null, null, null, null],
  allowExpandedSpecs: false,
  updatedAt: 0
}

export default function exploreSelector(state = baseState, action) {
  switch (action.type) {
    case REQUEST_EXACT_SPECS:
    case REQUEST_INDIVIDUAL_SPECS:
    case REQUEST_SUBSET_SPECS:
    case REQUEST_EXPANDED_SPECS:
      var { isFetchingSpecLevel: requestIsFetchingSpecLevel } = state;
      requestIsFetchingSpecLevel[action.selectedRecommendationLevel] = true;

      return {
        ...state,
        isFetchingSpecLevel: requestIsFetchingSpecLevel,
        isFetching: true,
        loading: false
      };

    case PROGRESS_EXACT_SPECS:
      if (action.progress && action.progress.length){
        var newProgress = state.progressByLevel.slice();
        newProgress[0] = action.progress;
        return { ...state, progressByLevel: newProgress};
      }
      return state;
    case PROGRESS_SUBSET_SPECS:
      if (action.progress && action.progress.length){
        var newProgress = state.progressByLevel.slice();
        newProgress[1] = action.progress;
        return { ...state, progressByLevel: newProgress};
      }
      return state;
    case PROGRESS_INDIVIDUAL_SPECS:
      if (action.progress && action.progress.length){
        var newProgress = state.progressByLevel.slice();
        newProgress[2] = action.progress;
        return { ...state, progressByLevel: newProgress};
      }
      return state;
    case PROGRESS_EXPANDED_SPECS:
      if (action.progress && action.progress.length){
        var newProgress = state.progressByLevel.slice();
        newProgress[3] = action.progress;
        return { ...state, progressByLevel: newProgress};
      }
      return state;

    case REQUEST_EXACT_SPECS:
    case REQUEST_INDIVIDUAL_SPECS:
    case REQUEST_SUBSET_SPECS:
    case REQUEST_EXPANDED_SPECS:
      var { isFetchingSpecLevel: requestIsFetchingSpecLevel } = state;
      requestIsFetchingSpecLevel[action.selectedRecommendationLevel] = true;

      return {
        ...state,
        isFetchingSpecLevel: requestIsFetchingSpecLevel,
        isFetching: true
      };

    case RECEIVE_EXACT_SPECS:
    case RECEIVE_INDIVIDUAL_SPECS:
    case RECEIVE_SUBSET_SPECS:
    case RECEIVE_EXPANDED_SPECS:

      var {
        isFetchingSpecLevel: receiveIsFetchingSpecLevel,
        loadedSpecLevel: receiveLoadedSpecLevel
      } = state;
      receiveIsFetchingSpecLevel[action.recommendationType.level] = false;
      receiveLoadedSpecLevel[action.recommendationType.level] = true;

      return {
        ...state,
        isFetchingSpecLevel: receiveIsFetchingSpecLevel,
        loadedSpecLevel: receiveLoadedSpecLevel
      };

    case SELECT_DATASET:
    case WIPE_PROJECT_STATE:
      return baseState;

    // TODO REINITIALIZE ON SPECIFIC FIELD SELECTION
    case SET_EXPLORE_QUERY_STRING:

      if (action.resetState) {
        return {
          ...state,
          queryString: action.queryString,
          progressByLevel: [ null, null, null, null ],
          isFetchingSpecLevel: [ false, false, false, false ],
          loadedSpecLevel: [ false, false, false, false ],
          specs: [],
          updatedAt: Date.now()
        }
      } else {
        return {
          ...state,
          queryString: action.queryString,
          updatedAt: Date.now()
        }
      }

    default:
      return state;
  }
}
