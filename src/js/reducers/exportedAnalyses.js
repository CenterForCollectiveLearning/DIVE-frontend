import {
  REQUEST_EXPORTED_ANALYSES,
  RECEIVE_EXPORTED_ANALYSES,
  RECEIVE_CREATED_EXPORTED_AGGREGATION,
  RECEIVE_CREATED_SAVED_AGGREGATION,
  RECEIVE_CREATED_EXPORTED_COMPARISON,
  RECEIVE_CREATED_SAVED_COMPARISON,
  RECEIVE_CREATED_EXPORTED_CORRELATION,
  RECEIVE_CREATED_SAVED_CORRELATION,      
  RECEIVE_CREATED_EXPORTED_REGRESSION,
  RECEIVE_CREATED_SAVED_REGRESSION,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  isFetching: false,
  loaded: false,
  data: {
    aggregation: [],
    comparison: [],
    correlation: [],
    regression: []
  },
  updatedAt: 0
}

export default function exportedAnalyses(state=baseState, action) {
  switch (action.type) {
    case REQUEST_EXPORTED_ANALYSES:
      return { ...state, isFetching: true, loaded: false };

    case RECEIVE_EXPORTED_ANALYSES:
      console.log('receive', action.data);
      return { ...state, isFetching: false, data: action.data, updatedAt: action.receivedAt, loaded: true };

    case RECEIVE_CREATED_EXPORTED_AGGREGATION, RECEIVE_CREATED_SAVED_AGGREGATION:
      var updatedResults = state.data.aggregation.slice();

      if (!updatedResults.find((spec) => spec.id == action.specId)) {
        updatedResults.push(action.exportedSpec);
      }

      return { ...state, isFetching: false, data: { ...state.data, aggregation: updatedResults }, updatedAt: action.receivedAt }

    case RECEIVE_CREATED_EXPORTED_COMPARISON, RECEIVE_CREATED_SAVED_COMPARISON:
      var updatedResults = state.data.comparison.slice();

      if (!updatedResults.find((spec) => spec.id == action.specId)) {
        updatedResults.push(action.exportedSpec);
      }

      return { ...state, isFetching: false, data: { ...state.data, comparison: updatedResults }, updatedAt: action.receivedAt }

    case RECEIVE_CREATED_EXPORTED_CORRELATION, RECEIVE_CREATED_SAVED_CORRELATION:
      var updatedResults = state.data.correlation.slice();

      if (!updatedResults.find((spec) => spec.id == action.specId)) {
        updatedResults.push(action.exportedSpec);
      }

      return { ...state, isFetching: false, data: { ...state.data, correlation: updatedResults }, updatedAt: action.receivedAt }

    case RECEIVE_CREATED_EXPORTED_REGRESSION, RECEIVE_CREATED_SAVED_REGRESSION:
      var updatedResults = state.data.regression.slice();

      if (!updatedResults.find((spec) => spec.id == action.specId)) {
        updatedResults.push(action.exportedSpec);
      }

      return { ...state, isFetching: false, data: { ...state.data, regression: updatedResults }, updatedAt: action.receivedAt }

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
