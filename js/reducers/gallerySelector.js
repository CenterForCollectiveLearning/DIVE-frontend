import {
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES,
  SELECT_FIELD_PROPERTY,
  SELECT_FIELD_PROPERTY_VALUE,
  SELECT_AGGREGATION_FUNCTION,
  SELECT_SORTING_FUNCTION
} from '../constants/ActionTypes';

export default function gallerySelector(state = {
  title: [],
  fieldProperties: [],
  conditionals: [],
  sortingFunctions: [],
  isFetching: false,
  updatedAt: 0
}, action) {

  const SORTING_FUNCTIONS = [
    {
      'label': 'relevance',
      'value': 'RELEVANCE',
      'selected': true
    },
    {
      'label': 'correlation',
      'value': 'CORRELATION',
      'selected': false
    },
    {
      'label': 'gini',
      'value': 'GINI',
      'selected': false
    },
    {
      'label': 'entropy',
      'value': 'ENTROPY',
      'selected': false
    },
    {
      'label': 'variance',
      'value': 'VARIANCE',
      'selected': false
    },
    {
      'label': 'std',
      'value': 'STD',
      'selected': false
    },
    {
      'label': 'mode',
      'value': 'MODE',
      'selected': false
    },
    {
      'label': 'regression_rsquared',
      'value': 'REGRESSION_RSQUARED',
      'selected': false
    },
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

      return { ...state, sortingFunctions: sortingFunctions };

    default:
      return state;
  }
}
