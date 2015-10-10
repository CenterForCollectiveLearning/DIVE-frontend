import React from 'react';

import { Route } from 'react-router';

import LandingPage from './components/Landing/LandingPage';
import App from './components/App/App';
import ProjectsPage from './components/ProjectsPage';
import DatasetsPage from './components/Datasets/DatasetsPage';
import DatasetUploadPage from './components/Datasets/DatasetUploadPage';
import DatasetInspectPage from './components/Datasets/DatasetInspectPage';
import VisualizationsPage from './components/Visualizations/VisualizationsPage';
import AnalysisPage from './components/Analysis/AnalysisPage';
import GalleryPage from './components/Visualizations/GalleryPage';
import BuilderPage from './components/Visualizations/BuilderPage';


// function redirectLandingOnEnter() {
//   return function(routerState, replaceState) {
//     if (routerState.location.pathname == '/') {
//       replaceState(null, '/home');
//     }
//   }
// }

export default (
  {/** }<Route path="/" component={ App } onEnter={redirectLandingOnEnter()}> **/}
  <Route path="/" component={ App } onEnter={redirectLandingOnEnter()}>
    <Route path="home" component={ LandingPage }/>
    <Route path="projects/:projectId" component={ ProjectsPage }>
      <Route path="datasets" component={ DatasetsPage }>
        <Route path="upload" component={ DatasetUploadPage }/>
        <Route path=":datasetId/inspect" component={ DatasetInspectPage }/>
      </Route>
      <Route path="visualizations" component={ VisualizationsPage }>
        <Route path="gallery" component={ GalleryPage }/>
        <Route path="builder/:specId" component={ BuilderPage }/>
      </Route>
      <Route path="analysis" component={ AnalysisPage }/>
    </Route>
  </Route>
);
