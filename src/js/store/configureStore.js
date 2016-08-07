import { createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { analyticsMiddleware } from '../middleware/analytics';
import debounce from 'redux-debounced';
import rootReducer from '../reducers/index';
import RavenMiddleware from 'redux-raven-middleware';

import createHistory from 'history/lib/createBrowserHistory';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: false
});

export default function configureStore(initialState) {
  const middleware = [
    debounce,
    thunkMiddleware,
    analyticsMiddleware,
    routerMiddleware(browserHistory),
    loggerMiddleware
  ];

  if (window.__env.NODE_ENV != "DEVELOPMENT") {
    middleware.push(RavenMiddleware('https://34b21b0198eb43d4bebc0a35ddd11b5c@app.getsentry.com/75309'))
  }

  const store = createStore(
    rootReducer,
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
