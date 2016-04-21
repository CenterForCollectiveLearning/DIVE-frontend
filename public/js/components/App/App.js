import React, { PropTypes } from 'react';
import styles from './App.sass';

import { createAnonymousUserIfNeeded } from '../../actions/UserActions';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

require("font-awesome-webpack");
// this seems real dumb;
require('react-select/less/select.less');
require('../../../css/app.less');
require('../../../css/griddle.less');

export class App extends React.Component {
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
  pushState: PropTypes.func.isRequired,
  user: PropTypes.object,
  children: PropTypes.node
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    user: user
  };
}

export default connect(mapStateToProps, { pushState, createAnonymousUserIfNeeded })(App);
