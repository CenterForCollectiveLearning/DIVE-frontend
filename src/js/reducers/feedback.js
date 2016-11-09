import {
  REQUEST_SEND_FEEDBACK,
  RECEIVE_SEND_FEEDBACK,
  CLOSE_FEEDBACK_MODAL
} from '../constants/ActionTypes';

const baseState = {
  isSending: false,
  received: false,
};

export default function feedback(state = baseState, action) {
  switch (action.type) {
    case REQUEST_SEND_FEEDBACK:
      return { isSending: true, received: false };

    case RECEIVE_SEND_FEEDBACK:
      return { isSending: false, received: true };

    case CLOSE_FEEDBACK_MODAL:
      return { isSending: false, received: false };

    default:
      return state;
  }
}
