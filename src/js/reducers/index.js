import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import composeSelector from './composeSelector';
import conditionals from './conditionals';
import correlationSelector from './correlationSelector';
import comparisonSelector from './comparisonSelector';
import datasets from './datasets';
import error from './error';
import preloadedDatasets from './preloadedDatasets';
import datasetSelector from './datasetSelector';
import documents from './documents'
import exportedSpec from './exportedSpec';
import exportedSpecs from './exportedSpecs';
import exportedAnalyses from './exportedAnalyses';
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
  error,
  exploreSelector,
  exportedSpec,
  exportedSpecs,
  exportedAnalyses,
  feedback,
  fieldProperties,
  filters,
  preloadedDatasets,
  project,
  projects,
  regressionSelector,
  specs,
  aggregationSelector,
  segmentationSelector,
  transformSelector,
  user,
  visualization,
  routing: routerReducer
});

export default rootReducer;
