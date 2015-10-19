import { combineReducers } from 'redux';
import {routerStateReducer as router} from 'redux-react-router';
import { LOAD, SAVE } from 'redux-storage';

import datasets from './datasets';
import datasetSelector from './datasetSelector';
import exportedSpec from './exportedSpec';
import fieldProperties from './fieldProperties';
import filters from './filters';
import project from './project';
import projects from './projects';
import regressionSelector from './regressionSelector';
import specs from './specs';
import user from './user';
import visualization from './visualization';

const rootReducer = combineReducers({
  datasets,
  datasetSelector,
  exportedSpec,
  fieldProperties,
  filters,
  project,
  projects,
  regressionSelector,
  specs,
  user,
  visualization,
  router
});

export default rootReducer;
