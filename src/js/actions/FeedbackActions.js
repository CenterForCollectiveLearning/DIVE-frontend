import {
  REQUEST_SEND_FEEDBACK,
  RECEIVE_SEND_FEEDBACK,
  CLOSE_FEEDBACK_MODAL
} from '../constants/ActionTypes';

import { fetch } from './api.js';

function requestSendFeedbackDispatcher(projectId, feedbackType, description) {
  return {
    type: REQUEST_SEND_FEEDBACK,
    projectId: projectId,
    feedbackType: feedbackType,
    description: description
  };
}

function receiveSendFeedbackDispatcher(json) {
  return {
    type: RECEIVE_SEND_FEEDBACK,
    feedbackId: json.feedbackId,
    message: json.message,
    receivedAt: Date.now()
  };
}

export function closeFeedbackModal() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_FEEDBACK_MODAL
    });
  }
}

export function submitFeedback(projectId, userId, userEmail, username, feedbackType, description) {
  const params = {
    project_id: projectId,
    user_id: userId,
    user_email: userEmail,
    username: username,
    feedback_type: feedbackType,
    description: description
  };

  return (dispatch) => {
    dispatch(requestSendFeedbackDispatcher(projectId, feedbackType, description));
    return fetch('/feedback/v1/feedback', {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveSendFeedbackDispatcher(json)))
      .catch(err => console.error("Error submitting feedback: ", err));
  }
}
