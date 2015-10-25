import {
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES,
  SELECT_FIELD_PROPERTY,
  SELECT_FIELD_PROPERTY_VALUE,
  SELECT_AGGREGATION_FUNCTION
} from '../constants/ActionTypes';

export default function gallerySelector(state = {
  fieldProperties: [],
  conditionals: [],
  isFetching: false,
  updatedAt: 0
}, action) {
  switch (action.type) {
    case REQUEST_FIELD_PROPERTIES:
      return { ...state, isFetching: true };

    case RECEIVE_FIELD_PROPERTIES:
      return { ...state, isFetching: false, fieldProperties: action.fieldProperties, updatedAt: action.receivedAt };

    case SELECT_FIELD_PROPERTY:
      const fieldProperties = state.fieldProperties.map((property) =>
        (property.id == action.selectedFieldPropertyId) ?
          new Object({ ...property, selected: !property.selected })
          : property
      );

      return { ...state, fieldProperties: fieldProperties, updatedAt: Date.now() };

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

    default:
      return state;
  }
}
