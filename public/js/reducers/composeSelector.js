import {
  WIPE_PROJECT_STATE,
  SELECT_COMPOSE_VISUALIZATION,
  SELECT_DOCUMENT,
  RECEIVE_DOCUMENTS,
  RECEIVE_CREATE_DOCUMENT,
  REQUEST_SAVE_DOCUMENT,
  RECEIVE_SAVE_DOCUMENT,
  SAVE_BLOCK
} from '../constants/ActionTypes';

import { BLOCK_FORMATS } from '../constants/BlockFormats';

const baseState = {
  blocks: [],
  documentId: null,
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
      var blocks = state.blocks.slice();
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

    case RECEIVE_DOCUMENTS:
      const documentId = parseInt(state.documentId);
      const selecedDocument = action.documents.find((doc) => doc.id == documentId);

      if (selecedDocument) {
        var selectedDocumentContent = selecedDocument.content;
        var selectedDocumentBlocks = selectedDocumentContent.blocks ? selectedDocumentContent.blocks : [];
        return {
          ...state,
          blocks: selectedDocumentBlocks
        }
      }

      return state;

    case SELECT_DOCUMENT:
      return {
        ...state,
        blocks: action.blocks,
        documentId: action.documentId
      };

    case RECEIVE_CREATE_DOCUMENT:
      return { ...state, documentId: action.document.id };

    case SAVE_BLOCK:
      const newBlocks = state.blocks.slice().map(function(block) {
        var newBlock = block;
        if (block.exportedSpecId == action.exportedSpecId) {
          newBlock[action.key] = action[action.key];
        }
        return newBlock;
      });
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
