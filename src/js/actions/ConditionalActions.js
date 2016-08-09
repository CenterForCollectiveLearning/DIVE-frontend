import {
  DELETE_CONDITIONAL
} from '../constants/ActionTypes';


export function deleteConditional(conditionalIndex) {
  return (dispatch) => {
    dispatch({
      type: DELETE_CONDITIONAL,
      conditionalIndex: conditionalIndex
    })
  }
}
