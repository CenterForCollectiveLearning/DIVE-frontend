import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './App.sass';
import { ConnectedRouter as Router } from 'react-router-redux';
import { push } from 'react-router-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import { requireAuthentication } from '../../routes';

import ProjectListPage from '../Landing/ProjectListPage';
import LandingPage from '../Landing/LandingPage';
import NotFoundPage from '../Landing/NotFoundPage';
import AboutPage from '../Landing/AboutPage';
import AuthPage from '../Auth/AuthPage';
import ProjectsPage from '../ProjectsPage';

import {
  AUTH_ERROR
} from '../../constants/ActionTypes';

import { createAnonymousUserIfNeeded } from '../../actions/UserActions';
import { connect } from 'react-redux';

const ConnectedSwitch = connect(state => ({
  location: state.location
}))(Switch);

// this seems real dumb;
require('react-select/less/select.less');
require('../../../css/app.less');
require('../../../css/griddle.less');

export class App extends Component {
  constructor(props) {
    super(props);

    const { user, createAnonymousUserIfNeeded } = this.props;

    if (!user.id || user.anonymous) {
      createAnonymousUserIfNeeded();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user, error, createAnonymousUserIfNeeded } = this.props;
    if (user.id && !nextProps.user.id) {
      createAnonymousUserIfNeeded();
    }
  }

  render() {
    console.o
    return (
      <div className={ styles.fillContainer + ' ' + styles.appContainer }>
        <Router history={ this.props.history }>
          <Switch>
            <Route path="/" component={ LandingPage }/> 
            <Route path="/projects/:projectId" component={ requireAuthentication(ProjectsPage) }/> 
            <Redirect to="/notfound" />
          </Switch>
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { user, error } = state;

  return {
    user,
    error
  };
}

export default connect(mapStateToProps, { createAnonymousUserIfNeeded, push })(App);
