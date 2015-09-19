import React from 'react';

import { Route } from 'react-router';

import App from './containers/App/App';
import ProjectsPage from './containers/ProjectsPage';
import DatasetsPage from './containers/Datasets/DatasetsPage';
import DataUploadPage from './containers/Datasets/DatasetUploadPage';
import VisualizationsPage from './containers/VisualizationsPage';

export default (
  <Route path="/" component={App} >
    <Route path="/projects/:projectTitle" component={ProjectsPage}>
      <Route path="datasets" component={DatasetsPage}>
        <Route path="upload" component={DataUploadPage}/>
      </Route>
      <Route path="visualizations" component={VisualizationsPage} />
    </Route>
  </Route>
);
