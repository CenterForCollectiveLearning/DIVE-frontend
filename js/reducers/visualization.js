import {
  CLEAR_VISUALIZATION,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA,
  REQUEST_CREATE_EXPORTED_SPEC,
  RECEIVE_CREATED_EXPORTED_SPEC,
  SELECT_BUILDER_VISUALIZATION_TYPE,
  SELECT_BUILDER_SORT_FIELD,
  SELECT_BUILDER_SORT_ORDER,
  SET_SHARE_WINDOW,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';


const baseState = {
  tableData: [],
  visualizationData: [],
  sortFields: [],
  sortOrders: [],
  spec: {},
  visualizationType: null,
  exportedSpecId: null,
  shareWindow: null,
  isExporting: false,
  isFetching: false
}

export default function visualization(state = baseState, action) {
  const SORT_ORDERS = [
    {
      'id': 'asc',
      'name': 'Ascending',
      'selected': true
    },
    {
      'id': 'desc',
      'name': 'Descending',
      'selected': false
    }
  ]

  const SORT_FIELDS = [
    {
      'id': 'name',
      'name': 'Name',
      'selected': true
    },
    {
      'id': 'value',
      'name': 'Value',
      'selected': false
    }
  ]
  switch (action.type) {
    case CLEAR_VISUALIZATION:
      return baseState;
    case REQUEST_VISUALIZATION_DATA:
      return { ...state, isFetching: true };
    case RECEIVE_VISUALIZATION_DATA:
      return {
        ...state,
        spec: action.spec,
        tableData: action.tableData,
        visualizationData: action.visualizationData,
        sortFields: SORT_FIELDS,
        sortOrders: SORT_ORDERS,
        isFetching: false
      };
    case SELECT_BUILDER_SORT_FIELD:
      const sortFields = state.sortFields.map((field) =>
        new Object({
          ...field,
          selected: field.id === action.selectedSortFieldId
        })
      );
      return { ...state, sortFields: sortFields };
    case SELECT_BUILDER_SORT_ORDER:
      const sortOrders = state.sortOrders.map((order) =>
        new Object({
          ...order,
          selected: order.id === action.selectedSortOrderId
        })
      );
      return { ...state, sortOrders: sortOrders };
    case SELECT_BUILDER_VISUALIZATION_TYPE:
      return { ...state, visualizationType: action.selectedType };
    case REQUEST_CREATE_EXPORTED_SPEC:
      return { ...state, isExporting: true };
    case RECEIVE_CREATED_EXPORTED_SPEC:
      return { ...state, exportedSpecId: action.exportedSpecId, isExporting: false };
    case SET_SHARE_WINDOW:
      return { ...state, shareWindow: action.shareWindow };
    case WIPE_PROJECT_STATE:
      return baseState;
    default:
      return state;
  }
}
