import React from 'react';

import { Route, IndexRoute } from 'react-router';
import { push } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import AboutPage from './components/Landing/AboutPage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import LandingPage from './components/Landing/LandingPage';
import ProjectListPage from './components/Landing/ProjectListPage';
import FeaturesPage from './components/Landing/FeaturesPage';
import App from './components/App/App';
import ProjectsPage from './components/ProjectsPage';
import DatasetsPage from './components/Datasets/DatasetsPage';
import DatasetUploadPage from './components/Datasets/DatasetUploadPage';
import DatasetInspectPage from './components/Datasets/DatasetInspectPage';
import DatasetTransformPage from './components/Datasets/DatasetTransformPage';
import VisualizationsPage from './components/Visualizations/VisualizationsPage';
import GalleryPage from './components/Visualizations/Gallery/GalleryPage';
import BuilderPage from './components/Visualizations/Builder/BuilderPage';
import AnalysisPage from './components/Analysis/AnalysisPage';
import RegressionBasePage from './components/Analysis/Regression/RegressionBasePage';
import SummaryPage from './components/Analysis/Summary/SummaryPage';
import CorrelationPage from './components/Analysis/Correlation/CorrelationPage';
import ComparisonPage from './components/Analysis/Comparison/ComparisonPage';
import ExportedVisualizationPage from './components/Visualizations/ExportedVisualization/ExportedVisualizationPage';
import ComposeBasePage from './components/Compose/ComposeBasePage';
import ComposePage from './components/Compose/ComposePage';
import NarrativeBasePage from './components/Compose/NarrativeBasePage';
import NarrativePage from './components/Compose/NarrativePage';

const requireAuthentication = UserAuthWrapper({
  authSelector: state => state.user,
  predicate: user => user.isAuthenticated,
  redirectAction: function({ pathname, query }){
    if (query.redirect) {
      return push(`${ pathname }?next=${ query.redirect }`);
    } else {
      return push(pathname);
    }
  },
  wrapperDisplayName: 'UserIsAuthenticated'
})

export default (
  <Route path="/" component={ App }>
    <Route path="/login" component={ LoginPage }/>
    <Route path="/register" component={ RegisterPage }/>

    <IndexRoute component={ LandingPage }/>
    <Route path="/landing" component={ LandingPage }>
      <Route path="/projects" component={ ProjectListPage }/>
      <Route path="/about" component={ AboutPage }/>
      <Route path="/features" component={ FeaturesPage }/>
    </Route>

    <Route path="/stories" component={ NarrativeBasePage }>
      <Route path=":documentId" component={ NarrativePage }/>
    </Route>

    <Route path="/projects/:projectId" component={ requireAuthentication(ProjectsPage) }>
      <Route path="datasets" component={ DatasetsPage }>
        <Route path="upload" component={ DatasetUploadPage }/>
        <Route path=":datasetId/inspect" component={ DatasetInspectPage }/>
        <Route path=":datasetId/transform" component={ DatasetTransformPage }/>
      </Route>

      <Route path="datasets/:datasetId" component={ DatasetsPage }>
        <Route path="visualize" component={ VisualizationsPage }>
          <Route path="explore" component={ GalleryPage }/>
          <Route path="builder/:specId" component={ BuilderPage }/>
        </Route>
        <Route path="summary" component={ SummaryPage }/>
        <Route path="comparison" component={ ComparisonPage }/>
        <Route path="analyze" component={ AnalysisPage }>
          <Route path="regression" component={ RegressionBasePage }/>
          <Route path="summary" component={ SummaryPage }/>
          <Route path="correlation" component={ CorrelationPage }/>
          <Route path="comparison" component={ ComparisonPage }/>
        </Route>
      </Route>
      <Route path="compose" component={ ComposeBasePage }>
        <Route path=":documentId" component={ ComposePage }/>
      </Route>
    </Route>
    <Route path="/share/projects/:projectId/visualizations/:exportedSpecId" component={ ExportedVisualizationPage }/>
  </Route>
);
