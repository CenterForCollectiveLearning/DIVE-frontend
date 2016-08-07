import {
  REQUEST_EXPORTED_SPEC,
  RECEIVE_EXPORTED_SPEC,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  tableData: [],
  visualizationData: [],
  spec: {},
  id: null,
  isFetching: false
}

export default function exportedSpec(state = baseState, action) {
  switch (action.type) {
    case REQUEST_EXPORTED_SPEC:
      return { ...state, isFetching: true }
    case RECEIVE_EXPORTED_SPEC:
      return { ...state, spec: action.spec, visualizationData: action.visualizationData, visualizationType: action.spec.vizTypes[0], isFetching: false }
    case WIPE_PROJECT_STATE:
      return baseState;
    default:
      return state;
  }
}
