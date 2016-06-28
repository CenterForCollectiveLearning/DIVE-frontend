import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import composeSelector from './composeSelector';
import correlationSelector from './correlationSelector'
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
import gallerySelector from './gallerySelector';
import project from './project';
import projects from './projects';
import regressionSelector from './regressionSelector';
import specs from './specs';
import summarySelector from './summarySelector';
import transformSelector from './transformSelector';
import user from './user';
import visualization from './visualization';

const rootReducer = combineReducers({
  composeSelector,
  correlationSelector,
  datasets,
  datasetSelector,
  documents,
  exportedSpec,
  exportedSpecs,
  exportedCorrelation,
  exportedCorrelations,
  exportedRegression,
  exportedRegressions,
  fieldProperties,
  filters,
  gallerySelector,
  project,
  projects,
  regressionSelector,
  specs,
  summarySelector,
  transformSelector,
  user,
  visualization,
  routing
});

export default rootReducer;
