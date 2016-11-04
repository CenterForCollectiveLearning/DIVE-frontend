import _ from 'underscore';

import {
  SELECT_CONDITIONAL,
  DELETE_CONDITIONAL,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseConditional = {
  conditionalIndex: null,
  conditionalId: _.uniqueId('conditional_'),
  fieldId: null,
  operator: null,
  value: null
};

const baseState = {
  lastUpdated: null,
  items: [ baseConditional ],
}

export default function conditionals(state = baseState, action) {
  switch (action.type) {
    case SELECT_CONDITIONAL:
      var conditionals = state.items.slice();
      conditionals = conditionals.map((conditional) =>
        (conditional.conditionalId == action.conditional.conditionalId) ? action.conditional : conditional
      );

      if (action.createNewConditional) {
        const newConditional = { ...baseConditional, conditionalId: _.uniqueId('conditional_') };
        conditionals.push(newConditional);
      }

      return { ...state, items: conditionals, lastUpdated: Date.now() };

    case DELETE_CONDITIONAL:
      var conditionals = state.items.slice();
      conditionals = conditionals.filter((conditional) => conditional.conditionalId != action.conditionalId);
      return { ...state, items: conditionals, lastUpdated: Date.now() };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
