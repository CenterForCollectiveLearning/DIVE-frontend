import {
  SELECT_FIELD_PROPERTY,
  SELECT_FIELD_PROPERTY_VALUE,
  SELECT_AGGREGATION_FUNCTION
} from '../constants/ActionTypes';

export default function gallerySelector(state = {
  selectedFieldIds: [],
  fieldValuePairs: [],
  updatedAt: 0
}, action) {
  switch (action.type) {
    case SELECT_FIELD_PROPERTY:
      var selectedFieldIds = state.selectedFieldIds.slice();
      const selectedFieldPropertyId = parseInt(action.selectedFieldPropertyId);

      selectedFieldIds = selectedFieldIds.indexOf(selectedFieldPropertyId) >= 0 ?
        selectedFieldIds.filter((fieldId) => fieldId != selectedFieldPropertyId) :
        [ ...selectedFieldIds, selectedFieldPropertyId ];

      return { ...state, selectedFieldIds: selectedFieldIds, updatedAt: Date.now() };

    case SELECT_FIELD_PROPERTY_VALUE:
      var fieldValuePairs = state.fieldValuePairs.slice();
      const allValuesMenuItemId = 'ALL_VALUES';

      if (action.selectedFieldPropertyValueId == allValuesMenuItemId) {
        fieldValuePairs = fieldValuePairs.filter((fieldValuePair) => fieldValuePair.fieldId != action.selectedFieldPropertyId);
      } else {
        const fieldValuePairIndex = state.fieldValuePairs.findIndex((fieldValuePair) => fieldValuePair.fieldId == action.selectedFieldPropertyId)

        if (fieldValuePairIndex >= 0) {
          fieldValuePairs[fieldValuePairIndex].valueId = action.selectedFieldPropertyValueId;
        } else {
          fieldValuePairs.push({
            fieldId: parseInt(action.selectedFieldPropertyId),
            valueId: action.selectedFieldPropertyValueId,
            type: 'c'
          });
        }
      }

      return { ...state, fieldValuePairs: fieldValuePairs, updatedAt: Date.now() };

    case SELECT_AGGREGATION_FUNCTION:
      var fieldValuePairs = state.fieldValuePairs.slice();
      const allTypesMenuItemId = 'ALL_TYPES';

      if (action.selectedFieldPropertyValueId == allTypesMenuItemId) {
        fieldValuePairs = fieldValuePairs.filter((fieldValuePair) => fieldValuePair.fieldId != action.selectedFieldPropertyId);
      } else {
        const fieldValuePairIndex = state.fieldValuePairs.findIndex((fieldValuePair) => fieldValuePair.fieldId == action.selectedFieldPropertyId)

        if (fieldValuePairIndex >= 0) {
          fieldValuePairs[fieldValuePairIndex].valueId = action.selectedFieldPropertyValueId;
        } else {
          fieldValuePairs.push({
            fieldId: parseInt(action.selectedFieldPropertyId),
            valueId: action.selectedFieldPropertyValueId,
            type: 'q'
          });
        }
      }

      return { ...state, fieldValuePairs: fieldValuePairs, updatedAt: Date.now() };

    default:
      return state;
  }
}
