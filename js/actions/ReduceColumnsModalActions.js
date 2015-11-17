import {
  TOGGLE_COLUMN_REDUCTION_MODAL,
  SELECT_COLUMN_REDUCTION_MODAL_COLUMN,
  SELECT_ALL_COLUMNS_REDUCTION_MODAL_COLUMN
} from '../constants/ActionTypes';


export function openReduceColumnsModal(dataset) {
  return {
    type: TOGGLE_COLUMN_REDUCTION_MODAL,
    dataset: dataset,
    modalOpen: true
  };
}

export function closeReduceColumnsModal() {
  return {
    type: TOGGLE_COLUMN_REDUCTION_MODAL,
    modalOpen: false
  };
}

export function selectReduceColumnsModalAllColumns(selected) {
  return {
    type: SELECT_ALL_COLUMNS_REDUCTION_MODAL_COLUMN,
    selected: selected
  }
}

export function selectReduceColumnsModalColumn(columnId, selected) {
  return {
    type: SELECT_COLUMN_REDUCTION_MODAL_COLUMN,
    columnId: columnId,
    selected: selected
  }
}


