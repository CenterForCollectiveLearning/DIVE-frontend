import {
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
      return { ...state, items: action.documents, isFetching: false, loaded: true, error: null };
    case RECEIVE_CREATE_DOCUMENT:
      const documents = state.items;
      documents.push(action.document);
      return { ...state, items: documents};
    case RECEIVE_DELETE_DOCUMENT:
      const reducedDocuments = state.items.filter((doc) => doc.id != action.documentId);
      return { ...state, items: documents};
    default:
      return state;
  }
}
