import React from 'react';

import { Route } from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';

import { App, Parent, Child } from '../containers/App';

export const routes = (
  <Route path="/" component={App}>
    <Route path="parent" component={Parent}>
      <Route path="child" component={Child} />
      <Route path="child/:id" component={Child} />
    </Route>
  </Route>
);
