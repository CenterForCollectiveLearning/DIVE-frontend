import {
  SELECT_TRANSFORM_DATASET,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  selectedDatasetIds: []
}

export default function transformSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_TRANSFORM_DATASET:
      var selectedDatasetIds = state.selectedDatasetIds.slice();

      if (selectedDatasetIds.find((datasetId) => datasetId == action.selectedDatasetId)) {
        selectedDatasetIds = selectedDatasetIds.filter((datasetId) => datasetId != action.selectedDatasetId);
      } else {
        selectedDatasetIds.push(action.selectedDatasetId);
      }

      return { ...state, selectedDatasetIds: selectedDatasetIds };
      
    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
