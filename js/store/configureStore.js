// import React from 'react';
// import _ from 'underscore';
// import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
// import thunkMiddleware from 'redux-thunk';
// import * as reducers from '../reducers/index';

// import createHistory from 'history/lib/createBrowserHistory';
// import { reduxReactRouter } from 'redux-react-router';
// import { routes } from '../routes/routes';

// let createStoreWithMiddleware;

// // Configure the dev tools when in DEV mode
// if (__DEV__) {
//   let { devTools, persistState } = require('redux-devtools');
//   createStoreWithMiddleware = compose(
//     applyMiddleware(thunkMiddleware),
//     reduxReactRouter({
//       routes,
//       createHistory
//     }),
//     devTools(),
//     persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
//   )(createStore);
// } else {
//   createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
// }

// const rootReducer = combineReducers(reducers);

// export default function configureStore(initialState) {
//   return createStoreWithMiddleware(rootReducer, initialState);
// }

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import rootReducer from '../reducers/Datasets';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/Datasets', () => {
      const nextRootReducer = require('../reducers/Datasets');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
