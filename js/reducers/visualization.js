import {
  CLEAR_VISUALIZATION,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA,
  REQUEST_CREATE_EXPORTED_SPEC,
  RECEIVE_CREATED_EXPORTED_SPEC,
  SELECT_BUILDER_VISUALIZATION_TYPE,
  SET_SHARE_WINDOW,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  tableData: [],
  visualizationData: [],
  spec: {},
  visualizationType: null,
  exportedSpecId: null,
  shareWindow: null,
  isExporting: false,
  isFetching: false
}

export default function visualization(state = baseState, action) {
  switch (action.type) {
    case CLEAR_VISUALIZATION:
      return {
        tableData: [],
        visualizationData: [],
        spec: {},
        visualizationType: null,
        exportedSpecId: null,
        shareWindow: null,
        isExporting: false,
        isFetching: false
      };
    case REQUEST_VISUALIZATION_DATA:
      return { ...state, isFetching: true };
    case RECEIVE_VISUALIZATION_DATA:
      return {
        ...state,
        spec: action.spec,
        tableData: action.tableData,
        visualizationData: action.visualizationData,
        isFetching: false
      };
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
