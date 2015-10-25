import {
  REQUEST_EXPORTED_SPEC,
  RECEIVE_EXPORTED_SPEC
} from '../constants/ActionTypes';

export default function exportedSpec(state = {
  tableData: [],
  visualizationData: [],
  spec: {},
  id: null,
  isFetching: false
}, action) {
  switch (action.type) {
    case REQUEST_EXPORTED_SPEC:
      return { ...state, isFetching: true }
    case RECEIVE_EXPORTED_SPEC:
      return { ...state, spec: action.spec, visualizationData: action.visualizationData, visualizationType: action.spec.vizTypes[0], isFetching: false }
    default:
      return state;
  }
}
