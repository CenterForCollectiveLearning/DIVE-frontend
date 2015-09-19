import React from 'react';

import { Route } from 'react-router';

import App from './containers/App';
import DatasetsPage from './containers/DatasetsPage';
import VisualizationsPage from './containers/VisualizationsPage';

export default (
  <Route path="/" component={App} >
    <Route path="datasets" component={DatasetsPage} />
    <Route path="visualizations" component={VisualizationsPage} />
  </Route>
);
