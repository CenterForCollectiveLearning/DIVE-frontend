import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'

import configureStore from './store/configureStore';

import routes from './routes'

// The following works in React 0.14 but isn't supported by standard Material UI yet
import EventPluginHub from 'react/lib/EventPluginHub';
import TapEventPlugin from 'react/lib/TapEventPlugin';
EventPluginHub.injection.injectEventPluginsByName({ TapEventPlugin });

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

console.log(window, window.amplitude);
history.listen(location => window.amplitude.logEvent('Page View', { pathname: location.pathname }));

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history } routes={ routes } />
  </Provider>,
  document.getElementById('main')
);
