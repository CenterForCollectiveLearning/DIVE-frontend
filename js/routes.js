import React from 'react';

import { Route } from 'react-router';

import App from './containers/App/App';
import ProjectsPage from './containers/ProjectsPage';
import DatasetsPage from './containers/Datasets/DatasetsPage';
import DatasetUploadPage from './containers/Datasets/DatasetUploadPage';
import DatasetInspectPage from './containers/Datasets/DatasetInspectPage';
import VisualizationsPage from './containers/VisualizationsPage';

export default (
  <Route path="/" component={ App } >
    <Route path="/projects/:projectTitle" component={ ProjectsPage }>
      <Route path="datasets" component={ DatasetsPage }>
        <Route path="upload" component={ DatasetUploadPage }/>
        <Route path=":datasetId/inspect" component={ DatasetInspectPage }/>
      </Route>
      <Route path="visualizations" component={ VisualizationsPage } />
    </Route>
  </Route>
);
