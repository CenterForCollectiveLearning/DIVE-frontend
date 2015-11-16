import {
  TOGGLE_COLUMN_REDUCTION_MODAL,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  columnReductionModalOpen: false,
  columns: []
}

export default function datasetSelector(state = baseState, action) {
  switch (action.type) {
    case TOGGLE_COLUMN_REDUCTION_MODAL:
      const columns = action.dataset.details.fieldNames.map((fieldName, i) =>
        new Object({
          id: i,
          name: fieldName,
          selected: false
        })
      );
      return { ...state, columnReductionModalOpen: action.modalOpen, columns: columns };
    case WIPE_PROJECT_STATE:
      return baseState;
    default:
      return state;
  }
}
