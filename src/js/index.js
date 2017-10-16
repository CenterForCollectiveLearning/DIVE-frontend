import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';

import { Router, Route, browserHistory } from 'react-router-dom'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import { FocusStyleManager } from '@blueprintjs/core';

import configureStore from './store/configureStore';

import routes from './routes';

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

const store = configureStore();
const history = createHistory();
history.listen(function(location) {
  const fullPath = location.pathname + location.search;
  window.amplitude.logEvent('Page View', { pathname: fullPath });
  window.ReactGA.set({ page: fullPath });
  window.ReactGA.pageview(fullPath);
});

const RouteWithSubRoutes = (route) => (
  <Route path={route.path} render={props => (
    <route.component {...props} routes={route.routes}/>
  )}/>
)

ReactDOM.render((
  <Provider store={ store }>
    <ConnectedRouter history={ history }>
      <div>
        { routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </div>
    </ConnectedRouter>
  </Provider>
  ), document.getElementById('main')
);
