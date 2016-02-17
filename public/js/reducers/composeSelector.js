import {
  WIPE_PROJECT_STATE,
  SELECT_COMPOSE_VISUALIZATION,
  SAVE_BLOCK_FORMAT,
  SAVE_BLOCK_TEXT,
  SAVE_BLOCK_HEADER,
  SAVE_VIZ_SIZE,
  REQUEST_SAVE_DOCUMENT,
  RECEIVE_SAVE_DOCUMENT
} from '../constants/ActionTypes';

import { BLOCK_FORMATS } from '../constants/BlockFormats';

const baseState = {
  blocks: [],
  saving: false,
  updatedAt: Date.now()
}

// blocks: [
//   {
//     heading:
//     body:
//     exportedSpecId:
//     format:
//     dimensions:
//   } ,...
// ]

export default function composeSelector(state = baseState, action) {
  switch (action.type) {

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
          format: BLOCK_FORMATS.TEXT_LEFT,
          dimensions: {}
        })
      }

      return { ...state, blocks: blocks };

    case SAVE_BLOCK_FORMAT:
      var newBlocks = state.blocks.slice().map((block) =>
        block.exportedSpecId == action.exportedSpecId ? { ...block, format: action.format } : block
      );

      return { ...state, blocks: newBlocks, updatedAt: Date.now() };

    case SAVE_VIZ_SIZE:
      var newBlocks = state.blocks.slice().map((block) =>
        block.exportedSpecId == action.exportedSpecId ? { ...block, dimensions: action.dimensions } : block
      );

      return { ...state, blocks: newBlocks, updatedAt: Date.now() };

    case SAVE_BLOCK_TEXT:
      var newBlocks = state.blocks.slice().map((block) =>
        block.exportedSpecId == action.exportedSpecId ? { ...block, body: action.text } : block
      );

      return { ...state, blocks: newBlocks, updatedAt: Date.now() };

    case SAVE_BLOCK_HEADER:
      var newBlocks = state.blocks.slice().map((block) =>
        block.exportedSpecId == action.exportedSpecId ? { ...block, heading: action.header } : block
      );

      return { ...state, blocks: newBlocks, updatedAt: Date.now() };

    case REQUEST_SAVE_DOCUMENT:
      return { ...state, saving: true };

    case RECEIVE_SAVE_DOCUMENT:
      return { ...state, saving: false };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
