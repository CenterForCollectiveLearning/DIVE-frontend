import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'

import configureStore from './store/configureStore';

import routes from './routes'

if (window.__env.NODE_ENV == "PRODUCTION") {
  ReactGA.initialize('UA-84666930-1');

} else {
  ReactGA.set = () => {};
  ReactGA.pageview = () => {};
}
window.ReactGA = ReactGA;


// The following works in React 0.14 but isn't supported by standard Material UI yet
import EventPluginHub from 'react/lib/EventPluginHub';
import TapEventPlugin from 'react/lib/TapEventPlugin';
EventPluginHub.injection.injectEventPluginsByName({ TapEventPlugin });

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

history.listen(function(location) {
  const fullPath = location.pathname + location.search;
  window.amplitude.logEvent('Page View', { pathname: fullPath });
  window.ReactGA.set({ page: fullPath });
  window.ReactGA.pageview(fullPath);
});

ReactDOM.render(
  <Provider store={ store }>
    <Router
      history={ history }
      routes={ routes }
    />
  </Provider>,
  document.getElementById('main')
);
