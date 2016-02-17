import {
  WIPE_PROJECT_STATE,
  SELECT_COMPOSE_VISUALIZATION,
  SET_BLOCK_FORMAT,
  SELECT_DOCUMENT,
  RECEIVE_DOCUMENTS,
  RECEIVE_CREATE_DOCUMENT
} from '../constants/ActionTypes';

import { BLOCK_FORMATS } from '../constants/BlockFormats';

const baseState = {
  blocks: [],
  documentId: null,
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
    case SET_BLOCK_FORMAT:
      const swappedBlocks = state.blocks.slice().map((block) =>
        block.exportedSpecId == action.id ? { ...block, format: action.format } : block
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

    case SELECT_DOCUMENT:
      return { ...state, documentId: action.documentId };

    case RECEIVE_CREATE_DOCUMENT:
      return { ...state, documentId: action.document.id };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
