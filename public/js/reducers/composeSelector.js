import {
  WIPE_PROJECT_STATE,
  SELECT_COMPOSE_VISUALIZATION,
  NEXT_BLOCK_FORMAT
} from '../constants/ActionTypes';

const BLOCK_FORMATS = {
  TEXT_TOP: 'TEXT_TOP',
  TEXT_BOTTOM: 'TEXT_BOTTOM',
  TEXT_LEFT: 'TEXT_LEFT',
  TEXT_RIGHT: 'TEXT_RIGHT'
}

const baseState = {
  blocks: [],
  updatedAt: Date.now()
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
    case NEXT_BLOCK_FORMAT:
      const getBlockWithNextFormat = ((block) => {
        switch(block.format){
          case BLOCK_FORMATS.TEXT_TOP:
            return { ...block, format: BLOCK_FORMATS.TEXT_RIGHT };
          case BLOCK_FORMATS.TEXT_RIGHT:
            return { ...block, format: BLOCK_FORMATS.TEXT_BOTTOM };
          case BLOCK_FORMATS.TEXT_BOTTOM:
            return { ...block, format: BLOCK_FORMATS.TEXT_LEFT };
          default:
            return { ...block, format: BLOCK_FORMATS.TEXT_TOP };
        }
      });

      const swappedBlocks = state.blocks.slice().map((block) =>
        block.exportedSpecId == action.id ? getBlockWithNextFormat(block) : block
      );

      return { ...state, blocks: swappedBlocks, updatedAt: Date.now() };

    case SELECT_COMPOSE_VISUALIZATION:
      var blocks = state.blocks.slice()
      const filteredBlocks = blocks.filter((block) => block.exportedSpecId != action.exportedSpecId);

      if (filteredBlocks.length != blocks.length) {
        blocks = filteredBlocks;
      } else {
        blocks.push({
          heading: action.heading,
          body: '',
          exportedSpecId: action.exportedSpecId,
          format: BLOCK_FORMATS.TEXT_LEFT
        })
      }

      return { ...state, blocks: blocks };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
