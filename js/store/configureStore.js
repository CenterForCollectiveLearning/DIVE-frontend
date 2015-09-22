import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/index';

import createHistory from 'history/lib/createBrowserHistory';
import { reduxReactRouter } from 'redux-react-router';
import routes from '../routes';

import { AUTH_REMOVE_TOKEN } from '../constants/ActionTypes';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: false
});

let createStoreWithMiddleware;

if (__DEV__) {
  let { devTools, persistState } = require('redux-devtools');
  createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware),
    reduxReactRouter({
      routes,
      createHistory
    }),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware),
    reduxReactRouter({
      routes,
      createHistory
    })
  )(createStore);
}

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
