import { createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { enableBatching } from 'redux-batched-actions';
import { analyticsMiddleware } from '../middleware/analytics';
import debounce from 'redux-debounced';
import {
    REQUEST_EXACT_SPECS,
    REQUEST_INDIVIDUAL_SPECS,
    REQUEST_SUBSET_SPECS,
    REQUEST_EXPANDED_SPECS
} from '../constants/ActionTypes';
import rootReducer from '../reducers/index';
import RavenMiddleware from 'redux-raven-middleware';

import createHistory from 'history/lib/createBrowserHistory';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default function configureStore(initialState) {
  const middleware = [
    debounce,
    thunkMiddleware,
    routerMiddleware(browserHistory)
  ];

  if (window.__env.NODE_ENV == "DEVELOPMENT") {
    middleware.push(loggerMiddleware)
  }

  if (window.__env.NODE_ENV != "DEVELOPMENT") {
    middleware.push(analyticsMiddleware)
    middleware.push(RavenMiddleware('https://34b21b0198eb43d4bebc0a35ddd11b5c@app.getsentry.com/75309'))
  }

  const store = createStore(
    enableBatching(rootReducer),
    initialState,
    applyMiddleware(
      ...middleware
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
