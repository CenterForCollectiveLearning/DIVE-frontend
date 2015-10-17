import {
  CLEAR_VISUALIZATION,
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA
} from '../constants/ActionTypes';

export default function visualization(state = {
  tableData: [],
  visualizationData: [],
  spec: {},
  isFetching: false
}, action) {
  switch (action.type) {
    case CLEAR_VISUALIZATION:
      return {
        tableData: [],
        visualizationData: [],
        spec: {},
        isFetching: false
      }
    case REQUEST_VISUALIZATION_DATA:
      return { ...state, isFetching: true }
    case RECEIVE_VISUALIZATION_DATA:
      return { ...state, spec: action.spec, tableData: action.tableData, visualizationData: action.visualizationData, isFetching: false }
    default:
      return state;
  }
}
