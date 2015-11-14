import {
  TOGGLE_COLUMN_REDUCTION_MODAL,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  columnReductionModalOpen: false
}

export default function datasetSelector(state = baseState, action) {
  switch (action.type) {
    case TOGGLE_COLUMN_REDUCTION_MODAL:
      return { ...state, columnReductionModalOpen: action.modalOpen };
    case WIPE_PROJECT_STATE:
      return baseState;
    default:
      return state;
  }
}
