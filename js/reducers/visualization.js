import {
  CLEAR_VISUALIZATION,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA,
  REQUEST_CREATE_EXPORTED_SPEC,
  RECEIVE_CREATED_EXPORTED_SPEC
} from '../constants/ActionTypes';

export default function visualization(state = {
  tableData: [],
  visualizationData: [],
  spec: {},
  exportedSpecId: null,
  isExporting: false,
  isFetching: false
}, action) {
  switch (action.type) {
    case CLEAR_VISUALIZATION:
      return {
        tableData: [],
        visualizationData: [],
        spec: {},
        exportedSpecId: null,
        isExporting: false,
        isFetching: false
      }
    case REQUEST_VISUALIZATION_DATA:
      return { ...state, isFetching: true }
    case RECEIVE_VISUALIZATION_DATA:
      return { ...state, spec: action.spec, tableData: action.tableData, visualizationData: action.visualizationData, isFetching: false }
    case REQUEST_CREATE_EXPORTED_SPEC:
      return { ...state, isExporting: true };
    case RECEIVE_CREATED_EXPORTED_SPEC:
      return { ...state, exportedSpecId: action.exportedSpecId, isExporting: false };
    default:
      return state;
  }
}
