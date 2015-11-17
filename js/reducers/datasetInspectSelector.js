import {
  TOGGLE_COLUMN_REDUCTION_MODAL,
  SELECT_COLUMN_REDUCTION_MODAL_COLUMN,
  SELECT_ALL_COLUMNS_REDUCTION_MODAL_COLUMN,
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
          selected: false,
          highlighted: false
        })
      );
      return { ...state, columnReductionModalOpen: action.modalOpen, columns: columns };

    case SELECT_COLUMN_REDUCTION_MODAL_COLUMN:
      const newSelectedColumns = state.columns.slice().map((column) =>
        column.id == action.columnId ?
          new Object({ ...column, selected: action.selected })
          : column
      );
      return { ...state, columns: newSelectedColumns };

    case SELECT_ALL_COLUMNS_REDUCTION_MODAL_COLUMN:
      const allSelectedColumns = state.columns.slice().map((column) =>
        new Object({ ...column, selected: action.selected })
      );
      return { ...state, columns: allSelectedColumns };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
