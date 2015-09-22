import React from 'react';

import { Route } from 'react-router';

import App from './components/App/App';
import ProjectsPage from './components/ProjectsPage';
import DatasetsPage from './components/Datasets/DatasetsPage';
import DatasetUploadPage from './components/Datasets/DatasetUploadPage';
import DatasetInspectPage from './components/Datasets/DatasetInspectPage';
import VisualizationsPage from './components/Visualizations/VisualizationsPage';
import GalleryPage from './components/Visualizations/GalleryPage';

export default (
  <Route path="/" component={ App } >
    <Route path="/projects/:projectTitle" component={ ProjectsPage }>
      <Route path="datasets" component={ DatasetsPage }>
        <Route path="upload" component={ DatasetUploadPage }/>
        <Route path=":datasetId/inspect" component={ DatasetInspectPage }/>
      </Route>
      <Route path="visualizations" component={ VisualizationsPage }>
        <Route path="gallery" component={ GalleryPage }/>
      </Route>
    </Route>
  </Route>
);
