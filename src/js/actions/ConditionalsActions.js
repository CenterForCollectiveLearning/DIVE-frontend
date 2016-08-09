import {
  SELECT_CONDITIONAL
} from '../constants/ActionTypes';

export function selectConditional(conditional) {
  return {
    type: SELECT_CONDITIONAL,
    conditional: conditional
  }
}
