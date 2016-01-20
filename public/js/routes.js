import React from 'react';

import { Route, IndexRoute } from 'react-router';

import AboutPage from './components/Landing/AboutPage';
import LandingPage from './components/Landing/LandingPage';
import HomePage from './components/Landing/HomePage';
import FeaturesPage from './components/Landing/FeaturesPage';
import App from './components/App/App';
import ProjectsPage from './components/ProjectsPage';
import DatasetsPage from './components/Datasets/DatasetsPage';
import DatasetUploadPage from './components/Datasets/DatasetUploadPage';
import DatasetInspectPage from './components/Datasets/DatasetInspectPage';
import VisualizationsPage from './components/Visualizations/VisualizationsPage';
import GalleryPage from './components/Visualizations/Gallery/GalleryPage';
import BuilderPage from './components/Visualizations/Builder/BuilderPage';
import AnalysisPage from './components/Analysis/AnalysisPage';
import RegressionBasePage from './components/Analysis/Regression/RegressionBasePage';
import RegressionPage from './components/Analysis/Regression/RegressionPage';
import SummaryPage from './components/Analysis/Summary/SummaryPage';
import ExportedVisualizationPage from './components/Visualizations/ExportedVisualization/ExportedVisualizationPage';

export default (
  <Route path="/" component={ App }>
    <IndexRoute component={ LandingPage }/>
    <Route path="/landing" component={ LandingPage }>
      <Route path="/home" component={ HomePage }/>
      <Route path="/about" component={ AboutPage }/>
      <Route path="/features" component={ FeaturesPage }/>
    </Route>
    <Route path="/projects/:projectId" component={ ProjectsPage }>
      <Route path="data" component={ DatasetsPage }>
        <Route path="upload" component={ DatasetUploadPage }/>
        <Route path=":datasetId/inspect" component={ DatasetInspectPage }/>
      </Route>
      <Route path="visualize" component={ VisualizationsPage }>
        <Route path="gallery" component={ GalleryPage }/>
        <Route path="builder/:specId" component={ BuilderPage }/>
      </Route>
      <Route path="analyze" component={ AnalysisPage }>
        <Route path="regression" component={ RegressionBasePage }>
          <Route path=":dependentVariable" component={ RegressionPage }/>
        </Route>
        <Route path="summary" component={ SummaryPage }/>
      </Route>
    </Route>
    <Route path="/share/projects/:projectId/visualizations/:exportedSpecId" component={ ExportedVisualizationPage }/>
  </Route>
);
