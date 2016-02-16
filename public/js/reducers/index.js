import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-react-router';

import composeSelector from './composeSelector';
import datasets from './datasets';
import datasetSelector from './datasetSelector';
import documents from './documents'
import documentSelector from './documentSelector'
import exportedSpec from './exportedSpec';
import exportedSpecs from './exportedSpecs';
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
  datasets,
  datasetSelector,
  documents,
  documentSelector,
  exportedSpec,
  exportedSpecs,
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
  router
});

export default rootReducer;
