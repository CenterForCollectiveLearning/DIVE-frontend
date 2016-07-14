import {
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES,
  RECEIVE_SET_FIELD_TYPE,
  RECEIVE_SET_FIELD_IS_ID,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  isFetching: false,
  loaded: false,
  items: [],
  datasetId: null,
  updatedAt: 0
}

export default function fieldProperties(state=baseState, action) {
  switch (action.type) {
    case REQUEST_FIELD_PROPERTIES:
      return { ...state, isFetching: true };

    case RECEIVE_FIELD_PROPERTIES:
      return { ...state, loaded: true, isFetching: false, items: action.fieldProperties, datasetId: action.datasetId, updatedAt: action.receivedAt };

    case RECEIVE_SET_FIELD_TYPE:
      var fieldProperties = state.items.slice().map((fieldProperty) =>
        fieldProperty.id == action.fieldProperty.id ?
          action.fieldProperty : fieldProperty
      );

      return { ...state, items: fieldProperties, updatedAt: action.receivedAt };

    case RECEIVE_SET_FIELD_IS_ID:
      var fieldProperties = state.items.slice().map((fieldProperty) =>
        fieldProperty.id == action.fieldProperty.id ?
          action.fieldProperty : fieldProperty
      );

      return { ...state, items: fieldProperties, updatedAt: action.receivedAt };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
