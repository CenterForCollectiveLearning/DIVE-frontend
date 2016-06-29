import {
  REQUEST_EXPORTED_CORRELATION,
  RECEIVE_EXPORTED_CORRELATION,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  tableData: [],
  visualizationData: [],
  spec: {},
  id: null,
  isFetching: false
}

export default function exportedCorrelation(state = baseState, action) {
  switch (action.type) {
    case REQUEST_EXPORTED_CORRELATION:
      return { ...state, isFetching: true }
    case RECEIVE_EXPORTED_CORRELATION:
      return { ...state, spec: action.spec, visualizationData: action.visualizationData, visualizationType: action.spec.vizTypes[0], isFetching: false }
    case WIPE_PROJECT_STATE:
      return baseState;
    default:
      return state;
  }
}
