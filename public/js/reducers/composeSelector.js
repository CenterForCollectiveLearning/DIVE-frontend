import {
  WIPE_PROJECT_STATE,
  SELECT_COMPOSE_VISUALIZATION,
  REMOVE_COMPOSE_VISUALIZATION,
  SELECT_DOCUMENT,
  SET_DOCUMENT_TITLE,
  RECEIVE_DOCUMENTS,
  RECEIVE_CREATE_DOCUMENT,
  REQUEST_SAVE_DOCUMENT,
  RECEIVE_SAVE_DOCUMENT,
  SAVE_BLOCK,
  RECEIVE_PUBLISHED_DOCUMENT
} from '../constants/ActionTypes';

import { BLOCK_FORMATS } from '../constants/BlockFormats';
import uuid from 'uuid';

const baseState = {
  title: null,
  blocks: [],
  documentId: null,
  saving: false,
  loaded: false,
  updatedAt: Date.now(),
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
      blocks.push({
        heading: action.heading,
        body: '',
        uuid: uuid.v4(),
        exportedSpecId: action.exportedSpecId,
        format: BLOCK_FORMATS.TEXT_LEFT,
        dimensions: {},
        updatedAt: Date.now()
      })

      return { ...state, blocks: blocks, updatedAt: Date.now() };

    case REMOVE_COMPOSE_VISUALIZATION:
      var blocks = state.blocks.slice();
      const filteredBlocks = blocks.filter((block) => block.exportedSpecId != action.exportedSpecId);

      blocks = filteredBlocks;
      return { ...state, blocks: blocks, updatedAt: Date.now() };

    case RECEIVE_DOCUMENTS:
      const documentId = parseInt(state.documentId);
      const selectedDocument = action.documents.find((doc) => doc.id == documentId);

      if (selectedDocument) {
        var selectedDocumentContent = selectedDocument.content;
        var selectedDocumentBlocks = selectedDocumentContent.blocks ? selectedDocumentContent.blocks : [];
        return {
          ...state,
          blocks: selectedDocumentBlocks,
          title: selectedDocument.title,
          loaded: true
        }
      }

      return state;

    case SELECT_DOCUMENT:
      return {
        ...state,
        blocks: action.blocks,
        documentId: action.documentId,
        title: action.title,
        loaded: true
      };

    case SET_DOCUMENT_TITLE:
      return {
        ...state,
        title: action.title,
        updatedAt: Date.now()
      };

    case RECEIVE_CREATE_DOCUMENT:
      return { ...state, documentId: action.document.id };

    case SAVE_BLOCK:
      const newBlocks = state.blocks.slice().map(function(block) {
        var newBlock = block;
        if (block.uuid == action.blockId) {
          newBlock[action.key] = action[action.key]
          newBlock.updatedAt = Date.now();
        }
        return newBlock;
      });
      return { ...state, blocks: newBlocks, updatedAt: Date.now() };

    case REQUEST_SAVE_DOCUMENT:
      return { ...state, saving: true };

    case RECEIVE_SAVE_DOCUMENT:
      return { ...state, saving: false };

    case RECEIVE_PUBLISHED_DOCUMENT:
      return {
        ...state,
        documentId: action.documentId,
        blocks: action.document.content.blocks,
        title: action.document.title,
        loaded: true
      }

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
