import {
  SELECT_CONDITIONAL,
  DELETE_CONDITIONAL
} from '../constants/ActionTypes';

export function selectConditional(conditional, createNewConditional) {
  return {
    type: SELECT_CONDITIONAL,
    conditional: conditional,
    createNewConditional: createNewConditional
  }
}

export function deleteConditional(conditionalId) {
  return (dispatch) => {
    dispatch({
      type: DELETE_CONDITIONAL,
      conditionalId: conditionalId
    })
  }
}
