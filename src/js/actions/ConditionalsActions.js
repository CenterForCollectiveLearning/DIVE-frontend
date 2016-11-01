import {
  SELECT_CONDITIONAL,
  DELETE_CONDITIONAL
} from '../constants/ActionTypes';

export function selectConditional(conditional) {
  return {
    type: SELECT_CONDITIONAL,
    conditional: conditional
  }
}

export function deleteConditional(conditionalIndex) {
  return (dispatch) => {
    dispatch({
      type: DELETE_CONDITIONAL,
      conditionalIndex: conditionalIndex
    })
  }
}
