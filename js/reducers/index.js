import { combineReducers } from 'redux';
import {routerStateReducer as router} from 'redux-react-router';
import { LOAD, SAVE } from 'redux-storage';

import datasets from './datasets';
import filters from './filters';
import project from './project';
import projects from './projects';
import fieldProperties from './fieldProperties';
import specs from './specs';
import datasetSelector from './datasetSelector';
import user from './user';
import visualization from './visualization';

const rootReducer = combineReducers({
  datasets,
  filters,
  project,
  projects,
  fieldProperties,
  specs,
  datasetSelector,
  user,
  visualization,
  router
});

export default rootReducer;
