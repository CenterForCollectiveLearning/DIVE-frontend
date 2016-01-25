import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, combineReducers } from 'redux';

import { ReduxRouter } from 'redux-react-router';

import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

import * as reducers from './reducers/index';

// The following works in React 0.14 but isn't supported by standard Material UI yet
import EventPluginHub from 'react/lib/EventPluginHub';
import TapEventPlugin from 'react/lib/TapEventPlugin';
EventPluginHub.injection.injectEventPluginsByName({ TapEventPlugin });

const store = configureStore();

if (window.__env.NODE_ENV == 'STAGING') {
  const password = prompt('Please enter your password to view this page.', '');

  if (password != "macro") {
    window.location="http://www.usedive.com/";
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ReduxRouter />
  </Provider>,
  document.getElementById('main')
);
