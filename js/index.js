import React, { Component } from 'react';
import { createStore, compose, combineReducers } from 'redux';

import { ReduxRouter } from 'redux-react-router';

import { Provider } from 'react-redux';
import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import configureStore from './store/configureStore';

import * as reducers from './reducers/index';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const store = configureStore();

class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>{() =>
          <ReduxRouter />
        }</Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }
}

React.render(<Root />, document.getElementById('main'));
