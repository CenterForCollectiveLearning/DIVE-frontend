import {
  WIPE_PROJECT_STATE,
  SELECT_COMPOSE_VISUALIZATION
} from '../constants/ActionTypes';

const BLOCK_FORMATS = {
  TEXT_TOP: 'TEXT_TOP',
  TEXT_BOTTOM: 'TEXT_BOTTOM',
  TEXT_LEFT: 'TEXT_LEFT',
  TEXT_RIGHT: 'TEXT_RIGHT'
}

const baseState = {
  blocks: [],
}

// blocks: [
//   {
//     heading: 
//     body: 
//     exportedSpecId:
//     format: 
//   } ,...
// ]

export default function composeSelector(state = baseState, action) {
  switch (action.type) {
    case SELECT_COMPOSE_VISUALIZATION:
      var blocks = state.blocks.slice()
      const filteredBlocks = blocks.filter((block) => block.exportedSpecId != action.exportedSpecId);

      if (filteredBlocks.length == blocks.length) {
        blocks = filteredBlocks;
      } else {
        blocks.push({
          heading: action.heading,
          body: '',
          exportedSpecId: action.exportedSpecId,
          format: BLOCK_FORMATS.TEXT_TOP
        })
      }

      return { ...state, blocks: blocks };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
