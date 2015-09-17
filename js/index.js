import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, combineReducers } from 'redux';

import { ReduxRouter } from 'redux-react-router';

import { Provider } from 'react-redux';
import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import configureStore from './store/configureStore';

import * as reducers from './reducers/index';

import App from './containers/App';

import EventPluginHub from 'react/lib/EventPluginHub';
import TapEventPlugin from 'react/lib/TapEventPlugin';
EventPluginHub.injection.injectEventPluginsByName({ TapEventPlugin });

const store = configureStore();

          // <ReduxRouter />
class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <App />
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('main'));
        // <DebugPanel top right bottom>
        //   <DevTools store={store} monitor={LogMonitor} />
        // </DebugPanel>
