import {
  REQUEST_VISUALIZATION_DATA,
  RECEIVE_VISUALIZATION_DATA,
  REQUEST_CREATE_SAVED_SPEC,
  SELECT_VISUALIZATION_CONDITIONAL,
} from '../constants/ActionTypes';

export function analyticsMiddleware({ getState }){
  return (next) => (action) => {
    switch(action.type) {
      case REQUEST_CREATE_SAVED_SPEC:
        amplitude.logEvent('Visualization: Saved');
        break;

      case REQUEST_VISUALIZATION_DATA:
        amplitude.logEvent('Visualization: Data Requested');
        break;

      case RECEIVE_VISUALIZATION_DATA:
        amplitude.logEvent('Visualization: Data Received');
        break;

      case SELECT_VISUALIZATION_CONDITIONAL:
        amplitude.logEvent('Visualization: Selected Conditional');
        break;
    }

    return next(action);
  }
}
