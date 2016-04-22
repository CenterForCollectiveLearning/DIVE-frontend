import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import debounce from 'redux-debounced';
import rootReducer from '../reducers/index';
import RavenMiddleware from 'redux-raven-middleware';

import createHistory from 'history/lib/createBrowserHistory';
import { reduxReactRouter } from 'redux-react-router';
import routes from '../routes';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: false
});

let createStoreWithMiddleware;

createStoreWithMiddleware = compose(
  applyMiddleware(
    debounce,
    thunkMiddleware,
    loggerMiddleware,
    RavenMiddleware('https://34b21b0198eb43d4bebc0a35ddd11b5c@app.getsentry.com/75309')
  ),
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore);

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
