import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { push } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

// Auth
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import AuthPage from './components/Auth/AuthPage';
import UnconfirmedPage from './components/Auth/UnconfirmedPage';
import ActivatePage from './components/Auth/ActivatePage';
import ResetPasswordEmailPage from './components/Auth/ResetPasswordEmailPage';
import ResetPasswordSubmitPage from './components/Auth/ResetPasswordSubmitPage';

// Landing
import AboutPage from './components/Landing/AboutPage';
import LandingPage from './components/Landing/LandingPage';
import ProjectListPage from './components/Landing/ProjectListPage';
import PreloadedProjectListPage from './components/Landing/PreloadedProjectListPage';
import StoryPage from './components/Landing/StoryPage';
import FeaturesPage from './components/Landing/FeaturesPage';

// Project
import App from './components/App/App';
import ProjectsPage from './components/ProjectsPage';

// Dataset
import DatasetsPage from './components/Datasets/DatasetsPage';
import DatasetUploadPage from './components/Datasets/DatasetUploadPage';
import DatasetInspectPage from './components/Datasets/DatasetInspectPage';
import DatasetTransformPage from './components/Datasets/DatasetTransformPage';

// Visualization
import VisualizationsPage from './components/Visualizations/VisualizationsPage';
import ExploreBasePage from './components/Visualizations/Explore/ExploreBasePage';
import SingleVisualizationPage from './components/Visualizations/SingleVisualization/SingleVisualizationPage';

// Analysis
import AnalysisPage from './components/Analysis/AnalysisPage';
import RegressionBasePage from './components/Analysis/Regression/RegressionBasePage';
import SegmentationPage from './components/Analysis/Segmentation/SegmentationPage';
import AggregationBasePage from './components/Analysis/Aggregation/AggregationBasePage';
import CorrelationBasePage from './components/Analysis/Correlation/CorrelationBasePage';
import ComparisonBasePage from './components/Analysis/Comparison/ComparisonBasePage';
import ExportedVisualizationPage from './components/Visualizations/ExportedVisualization/ExportedVisualizationPage';

// Compose
import ComposeBasePage from './components/Compose/ComposeBasePage';
import ComposePage from './components/Compose/ComposePage';
import NarrativeBasePage from './components/Compose/NarrativeBasePage';
import NarrativePage from './components/Compose/NarrativePage';


const requireAuthentication = UserAuthWrapper({
  authSelector: state => state.user,
  predicate: user => user.isAuthenticated,
  failureRedirectPath: '/auth/login',
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
    <Route path="/auth" component={ AuthPage }>
      <Route path="login" component={ LoginPage }/>
      <Route path="register" component={ RegisterPage }/>
      <Route path="activate/:token" component={ ActivatePage } />
      <Route path="unconfirmed" component={ UnconfirmedPage }/>
      <Route path="reset" component={ ResetPasswordEmailPage }/>
      <Route path="reset/:token" component={ ResetPasswordSubmitPage }/>
    </Route>

    <IndexRoute component={ LandingPage }/>
    <Route path="/landing" component={ LandingPage }>
      <Route path="/projects" component={ requireAuthentication(ProjectListPage) }/>
      <Route path="/preloaded" component={ requireAuthentication(PreloadedProjectListPage) }/>
      <Route path="/story" component={ StoryPage }/>
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
          <Route path="explore" component={ ExploreBasePage }/>
          <Route path="explore/:specId" component={ SingleVisualizationPage }/>
        </Route>
        <Route path="analyze" component={ AnalysisPage }>
          <Route path="regression" component={ RegressionBasePage }/>
          <Route path="aggregation" component={ AggregationBasePage }/>
          <Route path="correlation" component={ CorrelationBasePage }/>
          <Route path="comparison" component={ ComparisonBasePage }/>
          <Route path="segmentation" component={ SegmentationPage }/>
        </Route>
      </Route>
      <Route path="compose" component={ ComposeBasePage }>
        <Route path=":documentId" component={ ComposePage }/>
      </Route>
    </Route>
    <Route path="/share/projects/:projectId/visualizations/:exportedSpecId" component={ ExportedVisualizationPage }/>
  </Route>
);
