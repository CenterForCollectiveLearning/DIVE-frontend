import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/index';

import createHistory from 'history/lib/createBrowserHistory';
import { reduxReactRouter } from 'redux-react-router';
import routes from '../routes';
import storage from 'redux-storage'

import { AUTH_REMOVE_TOKEN } from '../constants/ActionTypes';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: false
});

const storageReducer = storage.reducer(rootReducer);
import createEngine from 'redux-storage/engines/localStorage';

const engine = storage.decorators.debounce(createEngine('dive'), 1500)
const storageMiddleware = storage.createMiddleware(engine);

let createStoreWithMiddleware;


createStoreWithMiddleware = compose(
  applyMiddleware(thunkMiddleware, loggerMiddleware, storageMiddleware),
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore);


export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  // Load previous state from local storage
  const load = storage.createLoader(engine);
  load(store)
    .catch(() => console.log('Failed to load previous state'));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
