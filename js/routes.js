import React from 'react';

import { Route, IndexRoute } from 'react-router';

import LandingPage from './components/Landing/LandingPage';
import App from './components/App/App';
import ProjectsPage from './components/ProjectsPage';
import DatasetsPage from './components/Datasets/DatasetsPage';
import DatasetUploadPage from './components/Datasets/DatasetUploadPage';
import DatasetInspectPage from './components/Datasets/DatasetInspectPage';
import TransformationPage from './components/Transformation/TransformationPage';
import VisualizationsPage from './components/Visualizations/VisualizationsPage';
import GalleryPage from './components/Visualizations/GalleryPage';
import BuilderPage from './components/Visualizations/BuilderPage';

export default (
  <Route path="/" component={ App }>
    <IndexRoute component={ LandingPage }/>
    <Route path="/projects/:projectId" component={ ProjectsPage }>
      <Route path="data" component={ DatasetsPage }>
        <Route path="upload" component={ DatasetUploadPage }/>
        <Route path=":datasetId/inspect" component={ DatasetInspectPage }/>
      </Route>
      <Route path="transform" component={ TransformationPage }/>
      <Route path="visualize" component={ VisualizationsPage }>
        <Route path="gallery" component={ GalleryPage }/>
        <Route path="builder/:specId" component={ BuilderPage }/>
      </Route>
    </Route>
  </Route>
);
