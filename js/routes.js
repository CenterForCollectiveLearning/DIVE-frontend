import React from 'react';

import { Route } from 'react-router';

import App from './containers/App';
import ProjectsPage from './containers/ProjectsPage';
import DatasetsPage from './containers/DatasetsPage';
import VisualizationsPage from './containers/VisualizationsPage';

export default (
  <Route path="/" component={App} >
    <Route path="/projects/:projectTitle" component={ProjectsPage}>
      <Route path="datasets" component={DatasetsPage}>
      </Route>
      <Route path="visualizations" component={VisualizationsPage} />
    </Route>
  </Route>
);
