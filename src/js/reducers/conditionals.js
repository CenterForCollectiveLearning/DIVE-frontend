import {
  SELECT_CONDITIONAL,
  DELETE_CONDITIONAL,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseConditional = {
  conditionalIndex: null,
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
      const conditionalExists = conditionals.find((conditional) => conditional.conditionalIndex == action.conditional.conditionalIndex);
      if (conditionalExists) {
        conditionals = conditionals.map((conditional) =>
          (conditional.conditionalIndex == action.conditional.conditionalIndex) ? action.conditional : conditional
        );
      } else {
        conditionals.splice(conditionals.length - 1, 0, action.conditional)
      }
      conditionals.push(baseConditional)
      return { ...state, items: conditionals, lastUpdated: Date.now() };

    case DELETE_CONDITIONAL:
      var conditionals = state.items.slice();
      conditionals = conditionals.filter((conditional) => conditional.conditionalIndex != action.conditionalIndex);
      return { ...state, items: conditionals, lastUpdated: Date.now() };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
