import {
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES,
  RECEIVE_SPECS,
  SELECT_FIELD_PROPERTY,
  SELECT_FIELD_PROPERTY_VALUE,
  SELECT_AGGREGATION_FUNCTION,
  SELECT_SORTING_FUNCTION,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  title: [],
  fieldProperties: [],
  specs: [],
  conditionals: [],
  sortingFunctions: [],
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

  const defaultTitle = [
    {
      type: 'plain',
      string: 'Summary visualizations'
    }
  ];

  const titleVisualizationStrings = [
    {
      type: 'plain',
      string: 'Visualizations'
    },
    {
      type: 'plain',
      string: ' of'
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
      return {
        ...state,
        isFetching: false,
        title: defaultTitle,
        fieldProperties: action.fieldProperties,
        sortingFunctions: SORTING_FUNCTIONS,
        updatedAt: action.receivedAt
      };

    case RECEIVE_SPECS:
      const selectedSortingFunction = state.sortingFunctions.find((func) => func.selected).value;
      const defaultSortSpecs = function (specA, specB) {
        return sortSpecsByFunction(selectedSortingFunction, specA, specB);
      };

      return { ...state, specs: action.specs.sort(defaultSortSpecs) };

    case SELECT_FIELD_PROPERTY:
      const fieldProperties = state.fieldProperties.map((property) =>
        (property.id == action.selectedFieldPropertyId) ?
          new Object({ ...property, selected: !property.selected })
          : property
      );

      const selectedPropertyStrings = fieldProperties
        .filter((property) => property.selected)
        .map((property) =>
          new Object({
            string: ` ${ property.name }`,
            type: 'field'
          })
      );

      const title = selectedPropertyStrings.length ?
        [ ...titleVisualizationStrings, ...selectedPropertyStrings ]
        : defaultTitle;

      return { ...state, fieldProperties: fieldProperties, title: title, updatedAt: Date.now() };

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

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
