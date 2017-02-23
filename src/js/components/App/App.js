import React, { Component, PropTypes } from 'react';
import styles from './App.sass';

import { createAnonymousUserIfNeeded } from '../../actions/UserActions';
import { connect } from 'react-redux';

// this seems real dumb;
require('react-select/less/select.less');
require('../../../css/app.less');
require('../../../css/griddle.less');

export class App extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.loaded && !this.props.user.loaded) {
      this.props.createAnonymousUserIfNeeded();
    }
  }

  render() {
    return (
      <div className={ styles.fillContainer + ' ' + styles.appContainer }>
        { this.props.children }
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    user: user
  };
}

export default connect(mapStateToProps, { createAnonymousUserIfNeeded })(App);
