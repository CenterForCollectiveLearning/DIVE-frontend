import {
  SELECT_TRANSFORM_DATASET,
} from '../constants/ActionTypes';

import { fetch, pollForTaskResult } from './api.js';

export function selectTransformDataset(selectedDatasetId) {
  return {
    type: SELECT_TRANSFORM_DATASET,
    selectedDatasetId: selectedDatasetId,
    selectedAt: Date.now()
  }
}
