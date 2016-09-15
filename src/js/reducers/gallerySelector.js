import {
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES,
  REQUEST_SPECS,
  RECEIVE_SPECS,
  SELECT_FIELD_PROPERTY,
  SELECT_FIELD_PROPERTY_VALUE,
  SELECT_AGGREGATION_FUNCTION,
  SELECT_SORTING_FUNCTION,
  SELECT_RECOMMENDATION_TYPE,
  WIPE_PROJECT_STATE,
  RECEIVE_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_TYPE,
  RECEIVE_SET_FIELD_COLOR,
  SET_QUERY_STRING
} from '../constants/ActionTypes';

const recommendationTypes = [
  {
    id: 'exact',
    level: 0
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
  recommendations: {
    types: recommendationTypes,
    currentLevel: 0,
    maxLevel: 3
  },
  fieldProperties: [],
  originalFieldProperties: [],
  specs: [],
  sortingFunctions: [],
  queryString: "",
  isFetching: false,
  updatedAt: 0
}

export default function gallerySelector(state = baseState, action) {

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
    case REQUEST_FIELD_PROPERTIES:
      return { ...state, isFetching: true };

    case RECEIVE_FIELD_PROPERTIES:
      var selectedPropertyStrings = action.fieldProperties
        .filter((property) => property.selected)
        .map((property) =>
          new Object({
            string: `${ property.name }`,
            type: 'field'
          })
      );

      return {
        ...state,
        isFetching: false,
        datasetId: action.datasetId,
        fieldProperties: action.fieldProperties,
        originalFieldProperties: action.fieldProperties,
        sortingFunctions: SORTING_FUNCTIONS,
        updatedAt: action.receivedAt
      };

    case RECEIVE_SET_FIELD_TYPE, RECEIVE_SET_FIELD_IS_ID, RECEIVE_SET_FIELD_COLOR:
      var fieldProperties = state.fieldProperties.slice().map((fieldProperty) =>
        fieldProperty.id == action.fieldProperty.id ? action.fieldProperty : fieldProperty
      );

      var fieldNameToColor = {};
      for (var i in fieldProperties) {
        var fieldProperty = fieldProperties[i];
        fieldNameToColor[fieldProperty['name']] = fieldProperty['color'];
      }

      return { ...state, fieldProperties: fieldProperties, updatedAt: action.receivedAt };

    case RECEIVE_SET_FIELD_IS_ID:
      var fieldProperties = state.fieldProperties.slice().map((fieldProperty) =>
        fieldProperty.id == action.fieldProperty.id ?
          action.fieldProperty : fieldProperty
      );
      return { ...state, fieldProperties: fieldProperties, updatedAt: action.receivedAt };

    case REQUEST_SPECS:
      return { ...state, isFetching: true };

    case RECEIVE_SPECS:
      const selectedSortingFunction = state.sortingFunctions.find((func) => func.selected).value;
      const defaultSortSpecs = function (specA, specB) {
        return sortSpecsByFunction(selectedSortingFunction, specA, specB);
      };

      var allSpecs = action.specs;
      if (action.recommendationType.level && state.specs) {
        allSpecs = [ ...state.specs, ...allSpecs ];
      }

      return { ...state, specs: allSpecs.sort(defaultSortSpecs) };

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

      var selectedPropertyStrings = fieldProperties
        .filter((property) => property.selected)
        .map((property) =>
          new Object({
            string: `${ property.name }`,
            type: 'field'
          })
      );

      return { ...state, fieldProperties: fieldProperties, specs: [], updatedAt: Date.now() };

    case SELECT_FIELD_PROPERTY_VALUE:
      const fieldPropertiesWithNewPropertyValue = state.fieldProperties.map((property) =>
        (property.id == action.selectedFieldPropertyId) ?
          new Object({ ...property, values: property.values.map((valueObject) =>
            new Object({ ...valueObject, selected: valueObject.value == action.selectedFieldPropertyValueId }))
          })
          : property
      );

      return { ...state, fieldProperties: fieldPropertiesWithNewPropertyValue, updatedAt: Date.now() };

    case SELECT_AGGREGATION_FUNCTION:
      const fieldPropertiesWithNewAggregationValue = state.fieldProperties.map((property) =>
        (property.id == action.selectedFieldPropertyId) ?
          new Object({ ...property, aggregations: property.aggregations.map((aggregationObject) =>
            new Object({ ...aggregationObject, selected: aggregationObject.value == action.selectedFieldPropertyValueId }))
          })
          : property
      );

      return { ...state, fieldProperties: fieldPropertiesWithNewAggregationValue, updatedAt: Date.now() };

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

    case SET_QUERY_STRING:
      return {
        ...state, queryString: action.queryString
      }

    default:
      return state;
  }
}
