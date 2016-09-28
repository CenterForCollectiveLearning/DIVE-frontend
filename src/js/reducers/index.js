import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import composeSelector from './composeSelector';
import conditionals from './conditionals';
import correlationSelector from './correlationSelector';
import comparisonSelector from './comparisonSelector';
import datasets from './datasets';
import datasetSelector from './datasetSelector';
import documents from './documents'
import exportedSpec from './exportedSpec';
import exportedSpecs from './exportedSpecs';
import exportedCorrelation from './exportedCorrelation';
import exportedCorrelations from './exportedCorrelations';
import exportedRegression from './exportedRegression';
import exportedRegressions from './exportedRegressions';
import fieldProperties from './fieldProperties';
import filters from './filters';
import feedback from './feedback';
import exploreSelector from './exploreSelector';
import project from './project';
import projects from './projects';
import regressionSelector from './regressionSelector';
import specs from './specs';
import aggregationSelector from './aggregationSelector';
import segmentationSelector from './segmentationSelector';
import transformSelector from './transformSelector';
import user from './user';
import visualization from './visualization';

const rootReducer = combineReducers({
  composeSelector,
  conditionals,
  correlationSelector,
  comparisonSelector,
  datasets,
  datasetSelector,
  documents,
  exploreSelector,
  exportedSpec,
  exportedSpecs,
  exportedCorrelation,
  exportedCorrelations,
  exportedRegression,
  exportedRegressions,
  feedback,
  fieldProperties,
  filters,
  project,
  projects,
  regressionSelector,
  specs,
  aggregationSelector,
  segmentationSelector,
  transformSelector,
  user,
  visualization,
  routing
});

export default rootReducer;
