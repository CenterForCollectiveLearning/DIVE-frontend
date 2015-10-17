import {
  SELECT_FIELD_PROPERTY,
  SELECT_AGGREGATION_FUNCTION,
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES
} from '../constants/ActionTypes';

export default function fieldProperties(state={
  isFetching: false,
  loaded: false,
  items: [],
  updatedAt: 0
}, action) {
  const AGGREGATIONS = [
    {
      value: "AVG",
      label: "mean",
      selected: false
    },
    {
      value: "MIN",
      label: "min",
      selected: false
    },
    {
      value: "MAX",
      label: "max",
      selected: false
    }
  ];

  switch (action.type) {
    case SELECT_FIELD_PROPERTY:
      var { items } = state;

      const newSelectedIndex = state.items.findIndex((property, i, props) =>
        property.id == action.selectedFieldPropertyId
      );

      if (newSelectedIndex >= 0) {
        items[newSelectedIndex].selected = !items[newSelectedIndex].selected;
      }

      return { ...state, items: items, updatedAt: action.receivedAt };
    case SELECT_AGGREGATION_FUNCTION:
      var { items } = state;

      const selectedAggregationFunctionFieldPropertyIndex = state.items.findIndex((property, i, props) =>
        property.id == action.selectedAggregationFunctionFieldPropertyId
      );

      if (selectedAggregationFunctionFieldPropertyIndex >= 0) {
        const selectedAggregationIndex = items[selectedAggregationFunctionFieldPropertyIndex].splitMenu.findIndex((aggregation, j, aggregations) =>
          aggregation.value == action.selectedAggregationFunction
        );

        var aggregations = AGGREGATIONS.slice();
        aggregations[selectedAggregationIndex].selected = true;

        if (selectedAggregationIndex >= 0) {
          items[selectedAggregationFunctionFieldPropertyIndex].splitMenu = aggregations;
        }
      }

      return { ...state, items: items, updatedAt: Date.now() };
    case REQUEST_FIELD_PROPERTIES:
      return { ...state, isFetching: true };
    case RECEIVE_FIELD_PROPERTIES:
      if (state.updatedAt !== action.recievedAt) {
        var aggregations = AGGREGATIONS.slice();
        aggregations[0].selected = true;

        const c = action.fieldProperties.c ? action.fieldProperties.c : [];
        const q = action.fieldProperties.q ? action.fieldProperties.q : [];

        var items = [ ...c, ...q ].map((property) =>
          new Object({
            ...property,
            selected: false,
            splitMenu: (property.generalType == 'q') ? aggregations : []
          })
        );
        return { ...state, isFetching: false, items: items, updatedAt: action.receivedAt };
      }
    default:
      return state;
  }
}
