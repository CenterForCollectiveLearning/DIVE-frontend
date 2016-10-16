import {
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES,
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
  SELECT_FIELD_PROPERTY,
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
    name: 'Regular',
    selected: true
  },
  {
    id: 'expanded',
    name: 'Expanded',
    selected: false
  }
]

const baseState = {
  datasetId: null,
  fieldProperties: [],
  originalFieldProperties: [],
  recommendationTypesToLevel: recommendationTypesToLevel,
  recommendationTypes: recommendationTypes,
  recommendationModes: recommendationModes,
  selectedRecommendationMode: 'regular',
  specs: [],
  sortingFunctions: [],
  queryString: "",
  progressByLevel: [ null, null, null, null ],
  isFetchingSpecLevel: [ false, false, false, false ],
  loadedSpecLevel: [ false, false, false, false ],
  isValidSpecLevel: [ false, false, false, false ],
  allowExpandedSpecs: false,
  updatedAt: 0
}

function getValidSpecLevelsFromNumFields(numSelectedFields, selectedRecommendationMode) {
  var isValidSpecLevel = [ false, false, false, false ];
  if (numSelectedFields == 0) {
    isValidSpecLevel[0] = true;  // Exact
  }
  if (numSelectedFields >= 1) {
    isValidSpecLevel[2] = true;  // Individual
    if (selectedRecommendationMode == 'expanded') {
      isValidSpecLevel[3] = true  // Expanded
    }
  }
  if (numSelectedFields >= 2) {
    isValidSpecLevel[0] = true;  // Exact
  }
  if (numSelectedFields >= 3) {
    isValidSpecLevel[1] = true;  // Subset
  }
  return isValidSpecLevel;
}

export default function exploreSelector(state = baseState, action) {

  const SORTING_FUNCTIONS = [
    {
      'label': 'relevance',
      'value': 'relevance',
      'selected': true
    },
    {
      'label': 'correlation',
      'value': 'correlation',
      'selected': false
    },
    {
      'label': 'gini',
      'value': 'gini',
      'selected': false
    },
    {
      'label': 'entropy',
      'value': 'entropy',
      'selected': false
    },
    {
      'label': 'variance',
      'value': 'variance',
      'selected': false
    },
    {
      'label': 'normality',
      'value': 'normality',
      'selected': false
    },
    {
      'label': 'size',
      'value': 'size',
      'selected': false
    }
  ];

  const sortSpecsByFunction = function(sortingFunction, specA, specB) {
    const scoreObjectSpecA = specA.scores.find((score) => score.type == sortingFunction);
    const scoreObjectSpecB = specB.scores.find((score) => score.type == sortingFunction);

    if (!scoreObjectSpecA && scoreObjectSpecB) {
      return 1; // a < b
    }

    if (scoreObjectSpecA && !scoreObjectSpecB) {
      return -1;
    }

    if (!scoreObjectSpecA && !scoreObjectSpecB) {
      return 0;
    }

    if (scoreObjectSpecA.score == scoreObjectSpecB.score) {
      return 0;
    }

    return (scoreObjectSpecA.score > scoreObjectSpecB.score) ? -1 : 1;
  };

  switch (action.type) {
    case SELECT_RECOMMENDATION_MODE:
      var numSelectedFields = state.fieldProperties.filter((property) => property.selected).length;
      var isValidSpecLevel = getValidSpecLevelsFromNumFields(numSelectedFields, action.selectedRecommendationModeId);

      var recommendationModes = state.recommendationModes.map((recommendationModeObject) =>
        (recommendationModeObject.id == action.selectedRecommendationModeId) ?
          new Object({
            ...recommendationModeObject,
            selected: true
          })
          : new Object({
            ...recommendationModeObject,
            selected: false
          })
      );
      return {
        ...state,
        selectedRecommendationMode: action.selectedRecommendationModeId,
        isValidSpecLevel: isValidSpecLevel,
        recommendationModes: recommendationModes
      }


    case RECEIVE_FIELD_PROPERTIES:
      var numSelectedFields = action.fieldProperties.filter((property) => property.selected).length;
      var isValidSpecLevel = getValidSpecLevelsFromNumFields(numSelectedFields, state.selectedRecommendationMode);
      return {
        ...state,
        datasetId: action.datasetId,
        fieldProperties: action.fieldProperties,
        originalFieldProperties: action.fieldProperties,
        isValidSpecLevel: isValidSpecLevel,
        sortingFunctions: SORTING_FUNCTIONS,
        updatedAt: action.receivedAt
      };

    case RECEIVE_SET_FIELD_TYPE:
    case RECEIVE_SET_FIELD_IS_ID:
    case RECEIVE_SET_FIELD_COLOR:
      var fieldProperties = state.fieldProperties.slice().map((fieldProperty) =>
        fieldProperty.id == action.fieldProperty.id ? action.fieldProperty : fieldProperty
      );

      var fieldNameToColor = {};
      for (var i in fieldProperties) {
        var fieldProperty = fieldProperties[i];
        fieldNameToColor[fieldProperty['name']] = fieldProperty['color'];
      }

      return { ...state, fieldProperties: fieldProperties, updatedAt: action.receivedAt };

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

      const selectedSortingFunction = state.sortingFunctions.find((func) => func.selected).value;
      const defaultSortSpecs = function (specA, specB) {
        return sortSpecsByFunction(selectedSortingFunction, specA, specB);
      };

      return {
        ...state,
        isFetchingSpecLevel: receiveIsFetchingSpecLevel,
        loadedSpecLevel: receiveLoadedSpecLevel
      };

    // case SELECT_FIELD_PROPERTY:
    //   var fieldProperties = state.fieldProperties.map((property) =>
    //     (property.id == action.selectedFieldPropertyId) ?
    //       new Object({
    //         ...property,
    //         selected: !property.selected,
    //         values: (!property.selected || property.generalType == 'q' || property.generalType == 't') ? property.values : property.values.map((value, i) => new Object({...value, selected: i == 0 })),
    //         aggregations: (!property.selected || property.generalType == 'c') ? property.aggregations : property.aggregations.map((aggregation, i) => new Object({...aggregation, selected: i == 0 }))
    //       })
    //       : property
    //   );
    //
    //   var selectedProperties = fieldProperties.filter((property) => property.selected);
    //   var numSelectedFields = selectedProperties.length;
    //   var isValidSpecLevel = getValidSpecLevelsFromNumFields(numSelectedFields, state.selectedRecommendationMode);
    //
    //   return {
    //     ...state,
    //     fieldProperties: fieldProperties,
    //     progressByLevel: [ null, null, null, null ],
    //     isFetchingSpecLevel: [ false, false, false, false ],
    //     loadedSpecLevel: [ false, false, false, false ],
    //     isValidSpecLevel: isValidSpecLevel,
    //     specs: [],
    //     updatedAt: Date.now()
    //   };

    case SELECT_SORTING_FUNCTION:
      const sortingFunctions = state.sortingFunctions.map((func) =>
        new Object({
          ...func,
          selected: func.value == action.selectedSortingFunction
        })
      );

      const sortSpecs = function(specA, specB) {
        return sortSpecsByFunction(action.selectedSortingFunction, specA, specB);
      };

      const sortedSpecs = state.specs.sort(sortSpecs);

      return { ...state, sortingFunctions: sortingFunctions, specs: sortedSpecs };

    case SELECT_RECOMMENDATION_TYPE:
      const recommendationTypes = state.recommendationTypes.map((typeObject) =>
        (typeObject.id == action.selectedRecommendationType) ?
          new Object({
            ...typeObject,
            selected: (typeObject.id == action.selectedRecommendationType && !typeObject.selected)
          })
        : typeObject
      );
      return { ...state, recommendationTypes: recommendationTypes, updatedAt: Date.now() };

    case WIPE_PROJECT_STATE:
      return baseState;

    case SET_EXPLORE_QUERY_STRING:
      return {
        ...state, queryString: action.queryString
      }

    default:
      return state;
  }
}
