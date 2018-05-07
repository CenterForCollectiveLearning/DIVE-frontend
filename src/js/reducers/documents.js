import {
  REQUEST_DOCUMENTS,
  RECEIVE_DOCUMENTS,
  RECEIVE_CREATE_DOCUMENT,
  RECEIVE_DELETE_DOCUMENT,
  REQUEST_SAVE_DOCUMENT,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

const baseState = {
  isFetching: false,
  loaded: false,
  items: [],
  updatedAt: 0,
  progress: null,
  error: null
}

export default function documents(state=baseState, action) {
  switch(action.type) {
    case REQUEST_DOCUMENTS:
      return { ...state, isFetching: true, error: null };

    case RECEIVE_DOCUMENTS:
      const docs = action.documents.map((doc) => doc.content.blocks ? doc : new Object({ ...doc, content: { blocks : [] } }));
      return { ...state, items: docs, isFetching: false, loaded: true, error: null };

    case REQUEST_SAVE_DOCUMENT:
      const savedDocs = state.items.map((doc) => doc.id == action.documentId ? { ...doc, content: action.content } : doc);
      return { ...state, items: savedDocs };

    case RECEIVE_CREATE_DOCUMENT:
      const documents = state.items.slice();
      documents.push(action.document);
      return { ...state, items: documents };

    case RECEIVE_DELETE_DOCUMENT:
      const reducedDocuments = state.items.filter((doc) => doc.id != parseInt(action.documentId));
      return { ...state, items: reducedDocuments };

    case WIPE_PROJECT_STATE:
      return baseState;

    default:
      return state;
  }
}
