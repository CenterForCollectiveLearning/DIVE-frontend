import {
  SELECT_FIELD_PROPERTY,
  SELECT_FIELD_PROPERTY_VALUE,
  SELECT_AGGREGATION_FUNCTION,
  SELECT_SORTING_FUNCTION,
  SELECT_RECOMMENDATION_TYPE,
  WIPE_PROJECT_STATE,
  RECEIVE_FIELD_PROPERTIES,
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_TYPE,
  RECEIVE_SET_FIELD_COLOR,
  SET_EXPLORE_QUERY_STRING,
  SELECT_RECOMMENDATION_MODE
} from '../constants/ActionTypes';

const statisticalRelationships = [
  {
    'label': 'Comparison',
    'value': 'comparison',
    'selected': true
  },
  {
    'label': 'Correlation',
    'value': 'correlation',
    'selected': false
  },
  {
    'label': 'Association',
    'value': 'association',
    'selected': false
  },
];

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

const baseState = {
  datasetId: null,
  fieldProperties: [],
  originalFieldProperties: [],
  specs: [],
  sortingFunctions: [],
  queryString: "",
  statisticalRelationships: statisticalRelationships,
  updatedAt: 0
}

export default function recommendSelector(state = baseState, action) {

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
      return {
        ...state,
        datasetId: action.datasetId,
        fieldProperties: action.fieldProperties,
        originalFieldProperties: action.fieldProperties,
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

    case SELECT_FIELD_PROPERTY:
      var fieldProperties = state.fieldProperties.map((property) =>
        (property.id == action.selectedFieldPropertyId) ?
          new Object({
            ...property,
            selected: !property.selected,
            values: (!property.selected || property.generalType == 'q' || property.generalType == 't') ? property.values : property.values.map((value, i) => new Object({...value, selected: i == 0 })),
            aggregations: (!property.selected || property.generalType == 'c') ? property.aggregations : property.aggregations.map((aggregation, i) => new Object({...aggregation, selected: i == 0 }))
          })
          : property
      );

      var selectedProperties = fieldProperties.filter((property) => property.selected);
      var numSelectedFields = selectedProperties.length;
      var isValidSpecLevel = getValidSpecLevelsFromNumFields(numSelectedFields, state.selectedRecommendationMode);

      return {
        ...state,
        fieldProperties: fieldProperties,
        progressByLevel: [ null, null, null, null ],
        isFetchingSpecLevel: [ false, false, false, false ],
        loadedSpecLevel: [ false, false, false, false ],
        isValidSpecLevel: isValidSpecLevel,
        specs: [],
        updatedAt: Date.now()
      };

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
