import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { enableBatching } from 'redux-batched-actions';
import { composeWithDevTools } from 'redux-devtools-extension';
import { analyticsMiddleware } from '../middleware/analytics';
import debounce from 'redux-debounced';

import rootReducer from '../reducers/index';
import RavenMiddleware from 'redux-raven-middleware';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default function configureStore(initialState, history) {
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
    middleware.push(RavenMiddleware(
      'https://34b21b0198eb43d4bebc0a35ddd11b5c@app.getsentry.com/75309', {
        maxBreadcrumbs: 5,
      }, {
        stateTransformer: ((state) => {})
    }))
  }

  const store = createStore(
    enableBatching(rootReducer),
    initialState,
    composeWithDevTools(applyMiddleware(
      ...middleware
    )),
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
