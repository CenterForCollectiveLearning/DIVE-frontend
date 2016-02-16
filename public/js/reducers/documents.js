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

function removeDocumentFromList(originalList, documentId) {
  console.log('In removeDocumentFromList', originalList, documentId);
  var removeIndex = array.map(function(item) {
    return item.id;
  }).indexOf(documentId);

  removeIndex > -1 && array.splice(removeIndex, 1);
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
      var documents = removeDocumentFromList(state.items, action.documentId);
      return { ...state, items: documents};
    default:
      return state;
  }
}
