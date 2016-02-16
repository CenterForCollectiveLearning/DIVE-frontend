import {
  SELECT_DOCUMENT,
  REQUEST_DOCUMENTS,
  RECEIVE_DOCUMENTS,
  REQUEST_DOCUMENT,
  RECEIVE_DOCUMENT,
  REQUEST_CREATE_DOCUMENT,
  RECEIVE_CREATE_DOCUMENT,
  REQUEST_UPDATE_DOCUMENT,
  RECEIVE_UPDATE_DOCUMENT,
  REQUEST_DELETE_DOCUMENT,
  RECEIVE_DELETE_DOCUMENT
} from '../constants/ActionTypes';

const baseState = {
  documentId: null,
  title: null,
  content: {},
}

export default function documentSelector(state=baseState, action) {
  switch(action.type) {
    case SELECT_DOCUMENT:
      console.log('SELECT DOCUMENT');
      return {
        ...state,
        documentId: action.documentId
      };
    case RECEIVE_DOCUMENTS:
      const firstDocument = action.documents[0];
      return {
        ...state,
        documentId: firstDocument.id,
        title: firstDocument.title,
        content: firstDocument.content,
      }
    default:
      return state;
  }
}
