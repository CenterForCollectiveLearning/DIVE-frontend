import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter as Router } from 'react-router-redux';

import { FocusStyleManager } from '@blueprintjs/core';

import configureStore from './store/configureStore';
import App from './components/App/App';

// import routes from './routes';

if (window.__env.NODE_ENV == "PRODUCTION") {
  ReactGA.initialize('UA-84666930-1');

} else {
  ReactGA.set = () => {};
  ReactGA.pageview = () => {};
}
window.ReactGA = ReactGA;

// Tap event support
injectTapEventPlugin();

// Focus management
FocusStyleManager.onlyShowFocusOnTabs();

const history = createHistory();
const store = configureStore(history);

history.listen((location, action) => {
  const fullPath = location.pathname + location.search;
  window.amplitude.logEvent('Page View', { pathname: fullPath });
  window.ReactGA.set({ page: fullPath });
  window.ReactGA.pageview(fullPath);
});

ReactDOM.render((
  <Provider store={ store }>
    <Router history={ history }>
      <App />
    </Router>
  </Provider>
  ), document.getElementById('main')
);
